import { useState, useRef, useEffect } from "react";
import { Field } from "./Field";
import { TextInput } from "./TextInput";
const accent = "bg-blue-800 text-white";
const accentHover = "bg-blue-700";

export function CreditForm() {
  const initialForm = {
    // Datos Personales
    apellidos: "",
    nombres: "",
    cedula: "",
    serie: "",
    estadoCivil: "",
    numeroHijos: "",
    calleCasa: "",
    barrio: "",
    ciudad: "",
    telefono: "",
    fechaNacimiento: "",
    vivePropia: true,
    alquilerCuanto: "",
    // Laboral
    dondeTrabaja: "",
    direccionTrabajo: "",
    salario: "",
    tieneIngresosExtras: false,
    ingresosExtrasCantidad: "",
    // Familiar
    nombreEsposa: "",
    companiaEsposa: "",
    telefonoEsposa: "",
    salarioEsposa: "",
    nombreDireccionPadre: "",
    nombreFamiliarNoVive: "",
    direccionTelefonoFamiliar: "",
    // Referencias: two
    referencias: [
      { nombre: "", direccion: "", telefono: "" },
      { nombre: "", direccion: "", telefono: "" },
    ],
    // Crédito
    usoDinero: "",
    tienePagoOtraCompania: "",
    casasComerciales: [
      { nombre: "", telefono: "", producto: "", año: "" },
      { nombre: "", telefono: "", producto: "", año: "" },
    ],
    firma: null,
  };

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas drawing for signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a"; // slate-900
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    draw(e);
  };
  const endDraw = () => {
    setIsDrawing(false);
    saveSignature();
  };
  const draw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!ctx.lastPos) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lastPos = { x, y };
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.lastPos = { x, y };
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lastPos = null;
    setForm((f) => ({ ...f, firma: null }));
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    // Simple check if blank: compare with empty canvas (not guaranteed but ok)
    setForm((f) => ({ ...f, firma: dataUrl }));
  };

  const generateEmailHTML= (data)=>{
    let html = `<div style="font-family: Arial; line-height:1.6;">`;
    for (const key in data) {
      const value = data[key];
  
      // Handle arrays (like referencias or casasComerciales)
      if (Array.isArray(value)) {
        html += `<h3 style="margin-top:10px; text-transform:capitalize;">${key}</h3>`;
        value.forEach((item, index) => {
          html += `<div style="margin-left:15px;">`;
          html += `<strong>${key.slice(0, -1)} ${index + 1}</strong><br>`;
          for (const subKey in item) {
            html += `<b>${subKey}:</b> ${item[subKey] || "-"}<br>`;
          }
          html += `</div>`;
        });
      }
  
      // Handle nested objects
      else if (typeof value === "object" && value !== null) {
        html += `<h3>${key}</h3>`;
        for (const subKey in value) {
          html += `<b>${subKey}:</b> ${value[subKey] || "-"}<br>`;
        }
      }
  
      // Handle normal values
      else {
        html += `<b>${key}:</b> ${value !== "" ? value : "-"}<br>`;
      }
    }
  
    html += `</div>`;
    return html;
}  

  // handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleReferenciaChange = (idx, key, value) => {
    setForm((f) => {
      const referencias = [...f.referencias];
      referencias[idx] = { ...referencias[idx], [key]: value };
      return { ...f, referencias };
    });
  };

  const handleCasaComercialChange = (idx, key, value) => {
    setForm((f) => {
      const casas = [...f.casasComerciales];
      casas[idx] = { ...casas[idx], [key]: value };
      return { ...f, casasComerciales: casas };
    });
  };

  
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Basic required fields example (you can expand)
    if (!form.nombres || !form.apellidos || !form.cedula) {
      setMessage("Por favor complete al menos Apellidos, Nombres y Cédula.");
      return;
    }

    // example payload
    const payload = { ...form, submittedAt: new Date().toISOString() };
    console.log("Solicitud enviada:", payload);
    setSubmitted(true);
    setMessage("Solicitud enviada correctamente. Nos pondremos en contacto.");

    const message= generateEmailHTML(form)
    try{
      fetch('https://backend-server-alpha-seven.vercel.app/sendEmail',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      })
      .then(res=>res.json())
      .then(data=>{
              console.log(data.message)
      })


    }catch(e){
      console.error('El error fue ',e)
    }
    //setForm(initialForm);
    // };
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-800">Solicitud de Crédito</h2>
        <p className="text-sm text-gray-600 mt-2">Complete los datos a continuación</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Datos Personales */}
          <fieldset className="border border-gray-100 rounded-lg p-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">Datos Personales</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Field label="Apellidos">
                <TextInput name="apellidos" value={form.apellidos} onChange={handleChange} />
              </Field>
              <Field label="Nombres">
                <TextInput name="nombres" value={form.nombres} onChange={handleChange} />
              </Field>
              <Field label="Cédula No.">
                <TextInput name="cedula" value={form.cedula} onChange={handleChange} />
              </Field>

              <Field label="Serie">
                <TextInput name="serie" value={form.serie} onChange={handleChange} />
              </Field>
              <Field label="Estado Civil">
                <TextInput name="estadoCivil" value={form.estadoCivil} onChange={handleChange} />
              </Field>
              <Field label="No. de Hijos">
                <TextInput name="numeroHijos" value={form.numeroHijos} onChange={handleChange} type="number" />
              </Field>

              <Field label="Calle / Casa No.">
                <TextInput name="calleCasa" value={form.calleCasa} onChange={handleChange} />
              </Field>
              <Field label="Ensanche o Barrio">
                <TextInput name="barrio" value={form.barrio} onChange={handleChange} />
              </Field>
              <Field label="Ciudad">
                <TextInput name="ciudad" value={form.ciudad} onChange={handleChange} />
              </Field>

              <Field label="Teléfono">
                <TextInput name="telefono" value={form.telefono} onChange={handleChange} />
              </Field>
              <Field label="Fecha de Nacimiento">
                <TextInput name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} type="date" />
              </Field>

              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="mb-2 font-medium text-gray-700">¿Vive en casa propia?</div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="vivePropia"
                        checked={form.vivePropia === true}
                        onChange={() => setForm((f) => ({ ...f, vivePropia: true }))}
                        className="form-radio"
                      />
                      Sí
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="vivePropia"
                        checked={form.vivePropia === false}
                        onChange={() => setForm((f) => ({ ...f, vivePropia: false }))}
                        className="form-radio"
                      />
                      No
                    </label>
                  </div>
                </div>

                {!form.vivePropia && (
                  <Field label="Si alquilada, ¿Cuánto paga?">
                    <TextInput name="alquilerCuanto" value={form.alquilerCuanto} onChange={handleChange} />
                  </Field>
                )}
              </div>
            </div>
          </fieldset>

          {/* Información Laboral */}
          <fieldset className="border border-gray-100 rounded-lg p-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">Información Laboral</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Field label="¿Dónde trabaja?">
                <TextInput name="dondeTrabaja" value={form.dondeTrabaja} onChange={handleChange} />
              </Field>
              <Field label="Dirección del trabajo">
                <TextInput name="direccionTrabajo" value={form.direccionTrabajo} onChange={handleChange} />
              </Field>
              <Field label="Salario (RDS)">
                <TextInput name="salario" value={form.salario} onChange={handleChange} type="number" />
              </Field>

              <div className="md:col-span-3">
                <div className="mb-2 font-medium text-gray-700">¿Tiene ingresos extras?</div>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="tieneIngresosExtras"
                      checked={form.tieneIngresosExtras}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Sí
                  </label>
                </div>

                {form.tieneIngresosExtras && (
                  <div className="mt-3 w-40">
                    <Field label="Cantidad (RDS)">
                      <TextInput name="ingresosExtrasCantidad" value={form.ingresosExtrasCantidad} onChange={handleChange} type="number" />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Información Familiar */}
          <fieldset className="border border-gray-100 rounded-lg p-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">Información Familiar</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Field label="Nombre de Esposa(o)">
                <TextInput name="nombreEsposa" value={form.nombreEsposa} onChange={handleChange} />
              </Field>
              <Field label="Compañía donde trabaja">
                <TextInput name="companiaEsposa" value={form.companiaEsposa} onChange={handleChange} />
              </Field>
              <Field label="Teléfono">
                <TextInput name="telefonoEsposa" value={form.telefonoEsposa} onChange={handleChange} />
              </Field>

              <Field label="Salario (RDS)">
                <TextInput name="salarioEsposa" value={form.salarioEsposa} onChange={handleChange} type="number" />
              </Field>

              <Field label="Nombre y dirección del padre">
                <TextInput name="nombreDireccionPadre" value={form.nombreDireccionPadre} onChange={handleChange} />
              </Field>

              <Field label="Nombre de un familiar que no viva con usted">
                <TextInput name="nombreFamiliarNoVive" value={form.nombreFamiliarNoVive} onChange={handleChange} />
              </Field>

              <Field label="Dirección y teléfono del familiar">
                <TextInput name="direccionTelefonoFamiliar" value={form.direccionTelefonoFamiliar} onChange={handleChange} />
              </Field>
            </div>
          </fieldset>

          {/* Referencias */}
          <fieldset className="border border-gray-100 rounded-lg p-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">Referencias</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {form.referencias.map((ref, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">Referencia {idx + 1}</h4>
                  <Field label="Nombre">
                    <TextInput value={ref.nombre} onChange={(e) => handleReferenciaChange(idx, "nombre", e.target.value)} />
                  </Field>
                  <Field label="Dirección">
                    <TextInput value={ref.direccion} onChange={(e) => handleReferenciaChange(idx, "direccion", e.target.value)} />
                  </Field>
                  <Field label="Teléfono">
                    <TextInput value={ref.telefono} onChange={(e) => handleReferenciaChange(idx, "telefono", e.target.value)} />
                  </Field>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Información de crédito */}
          <fieldset className="border border-gray-100 rounded-lg p-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">Información de crédito</legend>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Field label="¿Qué uso le dará al dinero solicitado?">
                <TextInput name="usoDinero" value={form.usoDinero} onChange={handleChange} />
              </Field>

              <Field label="¿Tiene pago que hacer en otra compañía?">
                <TextInput name="tienePagoOtraCompania" value={form.tienePagoOtraCompania} onChange={handleChange} placeholder="Sí / No y detalles" />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.casasComerciales.map((c, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-2">Casa Comercial {idx + 1}</h4>
                    <Field label="Nombre">
                      <TextInput value={c.nombre} onChange={(e) => handleCasaComercialChange(idx, "nombre", e.target.value)} />
                    </Field>
                    <Field label="Teléfono">
                      <TextInput value={c.telefono} onChange={(e) => handleCasaComercialChange(idx, "telefono", e.target.value)} />
                    </Field>
                    <Field label="Producto / Efecto que compró">
                      <TextInput value={c.producto} onChange={(e) => handleCasaComercialChange(idx, "producto", e.target.value)} />
                    </Field>
                    <Field label="Año">
                      <TextInput value={c.año} onChange={(e) => handleCasaComercialChange(idx, "año", e.target.value)} />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Firma */}
          <fieldset className="border border-gray-100 rounded-lg p-4">
            <legend className="px-2 text-sm font-semibold text-gray-700">Firma del solicitante</legend>
            <div className="mt-4">
              <div className="mb-2 text-sm text-gray-600">Firme dentro del recuadro (puede usar mouse o touch)</div>
              <div className="rounded-md bg-white p-2">
                <canvas
                  ref={canvasRef}
                  className="w-full h-40 canvas-border rounded-md"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={() => endDraw()}
                  onMouseLeave={() => endDraw()}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={() => endDraw()}
                />
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={clearSignature} className="px-3 py-2 rounded-md border text-sm">Limpiar</button>
                  <div className="text-sm text-gray-600 self-center">
                    {form.firma ? "Firma guardada" : "Sin firma"}
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4">
            <div>
              {message && <div className="text-sm text-green-700">{message}</div>}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg font-semibold shadow ${accent} hover:${accentHover}`}
              >
                Enviar Solicitud
              </button>
            </div>
          </div>
        </form>
      </div>

      {submitted && (
        <div className="mt-6 text-sm text-gray-600">
          Gracias. Su solicitud fue recibida. Le contactaremos a la brevedad.
        </div>
      )}
    </section>
  );
}
