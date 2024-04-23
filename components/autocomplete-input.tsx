import React, { useState } from "react";
import { Input } from "./ui/input";

const AutocompleteInput = ({
  options,
  setInputValue,
  inputValue,
  label,
  placeholder,
  className,
  disabled
}: {
  options?: any;
  setInputValue: any;
  inputValue: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) => {
  // component state

  const [suggestions, setSuggestions] = useState<string[]>([]);

  // handle input changes
  const handleInputChange = (event: any) => {
    const inputText:string = event.target.value;
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
      // setInputValue('');
      setSuggestions([]);
    }
  };

  const handleOptionClick = (option: any) => {
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
        // onBlur={handleInputBlur}
      />
      {suggestions && (
        <ul className=" bg-slate-100 gap-1">
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
