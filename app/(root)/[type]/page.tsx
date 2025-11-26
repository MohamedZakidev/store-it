import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.action";
import {
  convertFileSize,
  getFileTypesParams,
  getUsageSummary,
} from "@/lib/utils";
import { FileType, totalSpaceType } from "@/types";

async function page({
  searchParams,
  params,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const type = ((await params)?.type as string) || "";
  const sort = ((await searchParams)?.sort as string) || "$createdAt-desc";

  const types = getFileTypesParams(type) as FileType[] | [];
  const files = await getFiles({ types, sort, limit: 10 });
  const totalSpace = await getTotalSpaceUsed();
  const totalSize = getUsageSummary(totalSpace as totalSpaceType);
  const totalTypeSize = totalSize.filter(
    (item) => item.title.toLocaleLowerCase() === type
  )[0].size;

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalTypeSize)}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render files */}
      {files && files.total > 0 ? (
        <section className="file-list">
          {files.rows.map((file) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
      {/* Render files */}
    </div>
  );
}

export default page;
