import React, { useState } from "react";
import { Input } from "./ui/input";

const AutocompleteInput = ({
  options,
  setInputValue,
  inputValue,
  label,
  placeholder,
  className,
  disabled,
}: {
  options?: any;
  setInputValue: any;
  inputValue: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setInputValue(inputText);

    if (!options) return;

    const filteredSuggestions = options.filter((option: any) =>
      option.toLowerCase().startsWith(inputText.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleInputBlur = () => {
    if (!suggestions.includes(inputValue) && inputValue !== "") {
      setInputValue(inputValue);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-input">
      <span className="font-semibold text-primary">{label}</span>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <ul className="bg-slate-100 gap-1">
          {suggestions.map((suggestion) => (
            <li
              className="flex items-center p-4 cursor-pointer h-10 rounded-sm border border-slate-500"
              key={suggestion}
              onClick={() => handleOptionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AutocompleteInput;
