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

    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

      <div className="font-semibold mb-3">

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
          rounded-xl
          border
          border-slate-300
          p-4
          resize-none
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "

      />

    </div>

  );

}