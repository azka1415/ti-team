import type { Note } from "@prisma/client";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

export default function useFilteredNotes(notes: Note[]) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [uncompleted, setUncompleted] = useState(false);
  const [filteredNotFound, setFilteredNotFound] = useState(false);

  const sortedTimeNotes = notes.sort((a, b) => {
    const one = new Date(b.updatedAt).getTime();
    const two = new Date(a.updatedAt).getTime();
    return one - two;
  });

  const filteredNotesByQuery = useMemo(() => {
    if (query === "") {
      return sortedTimeNotes;
    }

    const filter = sortedTimeNotes.filter((note) => {
      return note.name.toLowerCase().includes(query.toLowerCase());
    });

    if (filter.length === 0) {
      setFound(false);
      return sortedTimeNotes;
    }

    setFound(true);
    return filter;
  }, [sortedTimeNotes, query]);

  useEffect(() => {
    if (query === "") {
      setFound(true);
    }
  }, [query, found]);

  const handleNoteFilter = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "checked_only") {
      setUncompleted(false);
      setCompleted(!completed);
      return;
    }
    setCompleted(false);
    setUncompleted(!uncompleted);
  };

  const filteredNotes = useMemo(() => {
    if (completed) {
      const completed = filteredNotesByQuery.filter(
        (note) => note.checked === true
      );
      if (completed.length === 0) {
        setFilteredNotFound(true);
        return filteredNotesByQuery;
      }
      setFilteredNotFound(false);
      return completed;
    }
    if (uncompleted) {
      const uncompleted = filteredNotesByQuery.filter(
        (note) => note.checked === false
      );
      if (uncompleted.length === 0) {
        setFilteredNotFound(true);
        return filteredNotesByQuery;
      }
      setFilteredNotFound(false);
      return uncompleted;
    }
    setFilteredNotFound(false);
    return filteredNotesByQuery;
  }, [completed, uncompleted, filteredNotesByQuery]);

  return {
    query,
    found,
    completed,
    uncompleted,
    filteredNotes,
    filteredNotFound,
    setQuery,
    handleNoteFilter,
  };
}
