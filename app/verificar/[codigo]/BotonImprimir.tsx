"use client";

export default function BotonImprimir() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm text-sidep-azul font-medium hover:underline"
    >
      Imprimir o guardar como PDF
    </button>
  );
}