import { useEffect, useState } from "react";

type Props = {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
};

export default function DeviceNotes({
  initialValue,
  onSave,
}: Props) {

  const [text, setText] =
    useState(initialValue);

  useEffect(() => {

    setText(initialValue);

  }, [initialValue]);

  useEffect(() => {

    const timer = setTimeout(() => {

      onSave(text);

    }, 800);

    return () => clearTimeout(timer);

  }, [text]);

  return (

    <div className="card-surface rounded-[24px] border border-white/10 p-5">

      <div className="mb-3 font-semibold text-white">

        Observaciones

      </div>

      <textarea

        rows={5}

        value={text}

        onChange={(e)=>
          setText(e.target.value)
        }

        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-slate-950/60
          p-4
          text-white
          resize-none
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "

      />

    </div>

  );

}