"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type IndustryBoxProps = {
  industries: string[];
  selectedIndustry: string;
  setSelectedIndustry: React.Dispatch<React.SetStateAction<string>>;
};

export default function IndustrFilterBox({
  industries, selectedIndustry, setSelectedIndustry
}: IndustryBoxProps) {

  return (
    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an industry" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry} >{industry}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select >
  );
}
