import { useState } from "react";
import BarcodeScanner from "../../components/Scanner/BarcodeScanner";

export default function ScanPage() {

  const [code, setCode] =
    useState("");

  return (

    <div className="max-w-xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">

        Escanear código

      </h1>

      {!code && (

        <BarcodeScanner

          onDetected={setCode}

          onClose={() => {}}

        />

      )}

      {code && (

        <div className="mt-10">

          <div className="text-lg">

            Código leído

          </div>

          <div className="mt-4 text-2xl font-bold break-all">

            {code}

          </div>

        </div>

      )}

    </div>

  );

}