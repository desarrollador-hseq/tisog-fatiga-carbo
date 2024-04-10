import React, { useState } from "react";
import { Input } from "./ui/input";

const AutocompleteInput = ({
  options,
  setInputValue,
  inputValue,
}: {
  options: any;
  setInputValue: any;
  inputValue: string;
}) => {
  // component state

  const [suggestions, setSuggestions] = useState<string[]>([]);

  // handle input changes
  const handleInputChange = (event: any) => {
    const inputText = event.target.value;
    setInputValue(inputText);

    // filter suggestions based on input value
    const filteredSuggestions = options.filter((option: any) =>
      option.toLowerCase().startsWith(inputText.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // handle input blur
  const handleInputBlur = () => {
    // add new option if it doesn't exist
    if (!suggestions.includes(inputValue) && inputValue !== "") {
      setInputValue(inputValue);
      // setInputValue('');
      setSuggestions([]);
    }
  };

  // handle option click
  const handleOptionClick = (option: any) => {
    setInputValue(option);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-input">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        // onBlur={handleInputBlur}
      />
      <ul className=" bg-slate-100 gap-1">
        {suggestions.map((suggestion) => (
          <li className="flex items-center p-4 cursor-pointer h-10 rounded-sm border border-slate-500" key={suggestion} onClick={() => handleOptionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteInput;
