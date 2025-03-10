import { useState, useRef, useEffect } from "react";
import "./ImeiGenerator.css";

export default function ImeiGenerator() {
  const [imei, setImei] = useState<string>("");
  const [tac, setTac] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFirstMessage, setIsFirstMessage] = useState<boolean>(true);
  const consoleRef = useRef<HTMLTextAreaElement>(null);

  const handleTacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTac(e.target.value);
    setError("");
  };

  const handleClick = () => {
    try {
      if (tac.length !== 8 || !/^\d{8}$/.test(tac)) {
        setError("Ingresa 8 dígitos!");
        return;
      }
      const nuevoImei = generarIMEI(tac);
      setImei(nuevoImei);
      appendToConsole(`✅ IMEI Generado: ${nuevoImei}`);
    } catch (error) {
      console.error(error);
    }
  };

  function calcularDigitoVerificacion(imei: string) {
    let suma = 0;
    for (let i = 0; i < imei.length; i++) {
      let num = parseInt(imei.charAt(i));
      if (i % 2 !== 0) {
        num *= 2;
        if (num > 9) num -= 9;
      }
      suma += num;
    }
    return (10 - (suma % 10)) % 10;
  }

  function generarIMEI(personalizadoTAC: string) {
    const numeroSerie = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const imeiParcial = personalizadoTAC + numeroSerie;
    const digitoVerificacion = calcularDigitoVerificacion(imeiParcial);
    return imeiParcial + digitoVerificacion;
  }

  const handleCheckClick = async () => {
    if (!imei || imei.length !== 15 || !/^\d{15}$/.test(imei)) {
      appendToConsole("❌ IMEI inválido. Asegúrate de generar un IMEI válido.");
      return;
    }

    setLoading(true);
    const headers = {
      Authorization: `Bearer heSqS2IhsZSEh4Qfx9M4rITbWwb79QEdWvZrVQji99f624f1`,
      "Content-Type": "application/json",
      "Accept-Language": "en",
    };

    const body = JSON.stringify({
      deviceId: String(imei),
      serviceId: "1", // Aquí puedes especificar el serviceId correspondiente
    });

    try {
      const response = await fetch("https://api.imeicheck.net/v1/checks", {
        method: "POST",
        headers,
        body,
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        appendToConsole(
          `❌ Error ${response.status}: ${
            result.message || "Solicitud inválida"
          }`
        );
        return;
      }

      appendToConsole(
        `✅ Verificación completada: ${JSON.stringify(result, null, 2)}`
      );
    } catch (error) {
      appendToConsole("❌ Error al conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  const appendToConsole = (message: string) => {
    setConsoleOutput((prevOutput) => {
      const newOutput = isFirstMessage ? message : prevOutput + `\n${message}`;
      setIsFirstMessage(false);
      return newOutput;
    });
  };

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  return (
    <div className="imei-generator">
      <p className="imei-generator-title">Type Allocation Code (TAC)</p>
      <input
        type="text"
        className="imei-generator-input"
        placeholder="12345678"
        value={tac}
        onChange={handleTacChange}
        maxLength={8}
        pattern="\d*"
      />
      <div className="imei-generator-div">
        {error && <p className="imei-error-message">❌ {error}</p>}
        <button className="imei-generator-btn btn" onClick={handleClick}>
          Generar
        </button>
      </div>
      <p className="imei-generator-console">Consola</p>
      <textarea
        name="imei-generator-console"
        id="imei-generator-console"
        ref={consoleRef}
        disabled
        value={consoleOutput}
      />
      {imei && (
        <button
          className="imei-check-btn btn"
          onClick={handleCheckClick}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Verificar IMEI"}
        </button>
      )}
    </div>
  );
}
