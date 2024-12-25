import React, { useState, useEffect, useRef } from "react";

// Define the type for a user
type User = {
  employee_id: number;
  employee_name: string;
  username: string;
};

// Define the props for the component
interface CustomUserSearchProps {
  onUserSelect: (user: User) => void;
}

const CustomUserSearch: React.FC<CustomUserSearchProps> = ({ onUserSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [users, setUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // New ref for the container

  const hasDuplicateEmployeeIds = (data: { employee_id: number }[]): boolean => {
    const seenIds = new Set<number>();
    for (const user of data) {
      if (seenIds.has(user.employee_id)) {
        console.error(`Duplicate employee_id found: ${user.employee_id}`);
        return true;
      }
      seenIds.add(user.employee_id);
    }
    return false;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/listusers`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();

        setUsers(Array.isArray(data) ? data.filter(user => user && user.employee_name && user.username) : []);
      
        if (Array.isArray(data) && hasDuplicateEmployeeIds(data)) {
          console.error("The data contains duplicate employee_id values.");
        } else {
          console.log("No duplicates found.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filterUsers = (searchTerm: string) => {
    const searchTerms = searchTerm.toLowerCase().split(/\s+/);

    return users.filter(user => {
      if (!user || !user.employee_name || !user.username) {
        console.log("Invalid user object:", user);
        return false;
      }
      const empName = user.employee_name.toLowerCase();
      const userName = user.username.toLowerCase();

      return searchTerms.every(term => 
        userName.includes(term) || empName.includes(term)
      );
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = filterUsers(value);
      setSuggestions(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (user: User) => {
    onUserSelect(user);
    setInputValue(user.employee_name);
    setIsOpen(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full"> {/* Changed to relative positioning and full width */}
      <div className="flex flex-col items-center w-full">
        <input
          ref={inputRef}
          type="text"
          style={{ color: 'black' }}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search users..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={suggestionRef}
          id="suggestions-list"
          role="listbox"
          style={{ color: 'black' }}
          className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto top-full mt-1" // Added top-full
        >
          {suggestions.map((user, index) => (
            <li
              key={user.employee_id}
              role="option"
              aria-selected={selectedIndex === index}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedIndex === index ? "bg-blue-50" : ""
              }`}
              onClick={() => handleSuggestionClick(user)}
            >
              <div className="font-medium">{user.employee_name}</div>
              <div className="text-sm text-gray-500">{user.username}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomUserSearch;