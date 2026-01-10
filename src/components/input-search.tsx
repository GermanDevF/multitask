import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function InputSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchValue, 500);

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  return (
    <div className="relative flex w-full items-center gap-2 lg:max-w-[300px]">
      <Input
        type="search"
        placeholder="Search..."
        className="bg-muted/50 w-full pr-8 focus-visible:ring-1 lg:max-w-[300px]"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
        <Search className="text-muted-foreground size-4" />
      </div>
    </div>
  );
}
