import { useState } from "react";
import BarcodeScanner from "../../components/Scanner/BarcodeScanner";
import { useNavigate, useParams } from "react-router-dom";

import {
    findByAssetTag
} from "../../services/scanner";
export default function ScanPage() {

  const [code, setCode] = useState("");

  return (

    <div className="max-w-xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">

        Escanear código

      </h1>

      {!code && (

        <BarcodeScanner
          onDetected={setCode}
        />

      )}

      {code && (

        <div className="text-2xl mt-10">

          Código leído:

          <div className="font-bold mt-4">

            {code}

          </div>

        </div>

      )}

    </div>

  );

}