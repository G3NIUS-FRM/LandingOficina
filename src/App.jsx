import React, { useRef, useState, useEffect } from "react";
import { CreditForm } from "./FormComponents/CreditForm";
const accent = "bg-blue-800 text-white";
const accentHover = "bg-blue-700";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            IP
          </div>
          <div>
            <h1 className="text-lg font-semibold">Inversiones Porteña, S.R.L.</h1>
            <p className="text-sm text-gray-600">Préstamos – Inversiones – Asesoría</p>
          </div>
        </div>

        <div className="text-sm text-gray-700 text-center md:text-right">
          <div>Calle José Contreras #60, Santo Domingo, R.D.</div>
          <div className="mt-1">
            Tel: <span className="font-medium">809-532-0540</span> | Fax: <span className="font-medium">809-533-8127</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero({ onCTAClick }) {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">
            Soluciones financieras confiables para su futuro
          </h2>
          <p className="mt-4 text-gray-600">
            En Inversiones Porteña ofrecemos préstamos responsables, oportunidades de inversión y asesoría
            financiera personalizada para ayudarle a alcanzar sus metas.
          </p>
          <div className="mt-6">
            <button
              onClick={onCTAClick}
              className={`px-6 py-3 rounded-lg font-semibold shadow ${accent} hover:${accentHover}`}
            >
              Solicitar Crédito Ahora
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-blue-800">¿Por qué elegirnos?</h3>
            <ul className="mt-3 text-gray-600 space-y-2">
              <li>- Tasas competitivas</li>
              <li>- Trámites sencillos y rápidos</li>
              <li>- Asesoría financiera experta</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}





export default function App() {
  const formRef = useRef(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero onCTAClick={scrollToForm} />
      <div ref={formRef}>
        <CreditForm />
      </div>

      <footer className="mt-12 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Inversiones Porteña, S.R.L. - Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}