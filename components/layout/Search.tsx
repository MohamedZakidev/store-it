"use client";
import { getSearchResultsAction } from "@/lib/actions/file.action";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import FormattedDateTime from "../FormattedDateTime";
import Thumbnail from "../Thumbnail";
import { Input } from "../ui/input";

function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchInput, setSearchInput] = useState(query || "");

  const [results, setResults] = useState<Models.DefaultRow[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearchInput] = useDebounce(searchInput, 1000);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    async function getSearchResults() {
      const files = await getSearchResultsAction({
        searchQuery: debouncedSearchInput,
      });
      if (files) {
        setResults(files?.rows);
        setIsOpen(true);
      }
    }
    if (debouncedSearchInput) {
      params.set("query", debouncedSearchInput);
      const newUrl = `?${params.toString()}`;

      if (newUrl !== `?${searchParams.toString()}`) {
        router.push(`?${params?.toString()}`);
      }
      getSearchResults();
    } else if (debouncedSearchInput.length === 0) {
      params.delete("query");
      router.push(`?${params.toString()}`);
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInput]);

  function handleClickItem(file: Models.DefaultRow) {
    setIsOpen(false);
    setResults([]);
    const fileTypeURL =
      file.type === "video" || file.type === "audio"
        ? "media"
        : file.type + "s";
    const fileUrl = `/${fileTypeURL}?query=${searchInput}`;
    router.push(fileUrl);
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search icon"
          width={24}
          height={24}
        />
        <Input
          value={searchInput}
          placeholder="Search ..."
          className="search-input"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {isOpen && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex  items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 break-all text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
