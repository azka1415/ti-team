import React, { useEffect } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { Transition } from "@headlessui/react";
import type { FilteredNotes } from "../../hooks/useFilteredNotes";

interface Props {
  useFilteredNotes: FilteredNotes;
  setShowItems: (value: boolean) => void;
}

export default function FilterNotes({ setShowItems, useFilteredNotes }: Props) {
  const {
    query,
    found,
    completed,
    uncompleted,
    filteredNotFound,
    setQuery,
    handleNoteFilter,
  } = useFilteredNotes;

  useEffect(() => {
    if (!found) {
      setShowItems(false);
    }
    if (found) {
      setShowItems(true);
    }
  }, [found, setShowItems]);

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-1 px-2 md:flex-row md:justify-start md:space-x-2 md:space-y-0">
      <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-gray-200 pr-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search"
          className="rounded-lg bg-gray-200 p-2 text-sm outline-none transition-all"
          autoComplete="off"
          placeholder="Search Notes"
        />

        <SearchIcon
          className={`flex items-center justify-center ${
            query.length === 0 ? "visible" : "collapse"
          }`}
        />

        <button
          className={`flex items-center justify-center ${
            query.length !== 0 ? "visible" : "hidden"
          }`}
          onClick={() => setQuery("")}
        >
          <CloseIcon className="flex w-2" />
        </button>
      </div>
      <div className="flex gap-2 rounded-lg border p-2">
        <label htmlFor="checked_only" className="text-sm">
          Show Completed Notes
        </label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => handleNoteFilter(e)}
          id="checked_only"
          className="rounded-lg bg-gray-200 p-2 text-sm outline-none transition-all"
        />
      </div>
      <div className="flex space-x-2 rounded-lg border p-2">
        <label htmlFor="unchecked_only" className="text-sm">
          Show Uncompleted Notes
        </label>
        <input
          type="checkbox"
          checked={uncompleted}
          onChange={(e) => handleNoteFilter(e)}
          id="unchecked_only"
          className="rounded-lg bg-gray-200 p-2 text-sm outline-none transition-all"
        />
      </div>
      <Transition
        show={!found || filteredNotFound}
        appear={true}
        enter="transition ease-out duration-300"
        enterFrom="transform translate-y-4"
        enterTo="transform translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="transform translate-y-0"
        leaveTo="transform translate-y-4"
      >
        <div className="flex flex-col items-center justify-center divide-y divide-black md:flex-row md:divide-x md:divide-y-0">
          {!found && <p className="px-1">No Notes Found</p>}
          {filteredNotFound && (
            <p className="px-1">No Notes Found With That Filter</p>
          )}
        </div>
      </Transition>
    </div>
  );
}
