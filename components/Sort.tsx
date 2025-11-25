"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

export default function Sort() {
  const router = useRouter();
  const path = usePathname();
  function handleSort(value: string) {
    router.push(`${path}?sort=${value}`);
  }
  return (
    <Select defaultValue={sortTypes[0].value} onValueChange={handleSort}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        <SelectGroup>
          {sortTypes.map((item) => (
            <SelectItem
              key={item.label}
              value={item.value}
              className="shad-select-item"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
