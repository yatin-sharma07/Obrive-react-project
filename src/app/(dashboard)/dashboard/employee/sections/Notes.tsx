"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import Board from "@/components/pages/Employee-dasboard/board/Board";
import { getNext3Days } from "@/components/pages/Employee-dasboard/constants/dates";
import {motion} from "framer-motion"
import FloatingButton from "@/components/pages/Employee-dasboard/board/FloatingButton";


export default function Notes() {
  const [notes, setNotes] = useState([]);
  const[isModalOpen,setIsModalOpen]=useState(false)

  useEffect(() => {

    
    const fetchNotes = async () => {
      const dates = getNext3Days();
      const start = dates[0].id;
      const end = dates[2].id;

      const res = await apiFetch(
        `/sticky-notes/by-range?startDate=${start}&endDate=${end}`
      );

      const json = await res.json();
      console.log("API response:", json.data);

      const mapped = json.data.map((note: any) => ({
        id: note.id.toString(),
        title: note.content,
        note_date: new Date(note.note_date).toLocaleDateString("en-CA"),
        color: note.color,
        position: note.position,
      }));

      setNotes(mapped);
    };

    fetchNotes();
  }, []);

  return (
    <>
    <motion.div className="flex h-full min-h-0 flex-col">
      <div>
        <h1 className="font-semibold text-xl ml-3 mb-5 mt-5">
          Check whats happening in the workspace!
        </h1>
           <FloatingButton onClick={() => setIsModalOpen(true)} />
      </div>
      <div className="flex-1 min-h-0">
        <Board tasks={notes} setTasks={setNotes} />
      </div>
    </motion.div>
    </>
  );
}
