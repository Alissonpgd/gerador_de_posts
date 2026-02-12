"use client";

import { useState, useRef, useEffect } from "react";
import { VagaCard } from "@/components/VagaCard";
import { toPng } from "html-to-image";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

export default function Home() {
  // --- ESTADOS ---
  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [email, setEmail] = useState("");
  const [cor, setCor] = useState("#660022");
  const [logo, setLogo] = useState<string>("");
  const [foto, setFoto] = useState<string>("");
  const [vagasSalvas, setVagasSalvas] = useState<any[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  // --- BUSCAR VAGAS (READ) ---
  const buscarVagas = async () => {
    try {
      const q = query(collection(db, "vagas"), orderBy("criadoEm", "desc"));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVagasSalvas(lista);
    } catch (error) {
      console.error("Erro ao buscar:", error);
    }
  };

  useEffect(() => {
    buscarVagas();
  }, []);

  // --- LÓGICA DE IMAGEM ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'foto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'logo') setLogo(base64);
        else setFoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SALVAR VAGA (CREATE) ---
  const salvarVaga = async () => {
    try {
      const dados = {
        titulo, empresa, subtitulo, email, cor, logoUrl: logo, imagemUrl: foto,
        requisitos: requisitos.split("\n").filter(r => r !== ""),
        criadoEm: serverTimestamp()
      };
      await addDoc(collection(db, "vagas"), dados);
      alert("Salvo com sucesso! ✅");
      buscarVagas(); // Atualiza a lista
    } catch (e) { alert("Erro ao salvar."); }
  };

  // --- EXCLUIR VAGA (DELETE) ---
  const excluirVaga = async (id: string) => {
    if (window.confirm("Deseja realmente apagar esta vaga?")) {
      try {
        await deleteDoc(doc(db, "vagas", id));
        setVagasSalvas(vagasSalvas.filter(v => v.id !== id));
      } catch (e) { alert("Erro ao excluir."); }
    }
  };

  // --- DOWNLOAD PNG ---
  const downloadImage = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `vaga-${empresa}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-200 p-4 md:p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* SEÇÃO SUPERIOR: GERADOR */}
        <div className="flex flex-col lg:flex-row gap-8 w-full items-start">

          {/* PAINEL ESQUERDO */}
          <section className="w-full lg:w-[400px] bg-white p-6 rounded-2xl shadow-xl space-y-5 sticky top-8">
            <header className="border-b pb-3 mb-4 text-red-900 font-black italic">
              <h1 className="text-2xl">RH CONECTA</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Gerador Profissional</p>
            </header>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Cargo</label>
                <input className="border-2 p-2 rounded-lg text-sm" value={titulo} onChange={e => setTitulo(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Subtitulo</label>
                <input className="border-2 p-2 rounded-lg text-sm" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Empresa</label>
                <input className="border-2 p-2 rounded-lg text-sm" value={empresa} onChange={e => setEmpresa(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                <input className="border-2 p-2 rounded-lg text-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Requisitos</label>
                <textarea className="border-2 p-2 rounded-lg h-20 text-sm" value={requisitos} onChange={e => setRequisitos(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="file" onChange={e => handleImageChange(e, 'logo')} className="text-[20px]" />
                <input type="file" onChange={e => handleImageChange(e, 'foto')} className="text-[20px]" />
              </div>
              <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-full h-8 cursor-pointer" />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button onClick={downloadImage} className="bg-red-900 text-white py-3 rounded-full font-bold uppercase text-xs">Baixar PNG</button>
              <button onClick={salvarVaga} className="bg-zinc-800 text-white py-3 rounded-full font-bold uppercase text-xs">💾 Salvar na Nuvem</button>
            </div>
          </section>

          {/* PAINEL DIREITO: PREVIEW */}
          <section className="flex-1 flex flex-col items-center">
            <div ref={cardRef}>
              <VagaCard
                titulo={titulo} nomeEmpresa={empresa} subtitulo={subtitulo}
                requisitos={requisitos.split("\n").filter(r => r !== "")}
                emailContato={email} logoUrl={logo} imagemUrl={foto} corPrincipal={cor}
              />
            </div>
          </section>
        </div>

        {/* SEÇÃO INFERIOR: HISTÓRICO (Onde entra a lixeira) */}
        <section className="w-full border-t border-zinc-300 pt-10 pb-20">
          <h2 className="text-3xl font-black text-gray-800 italic uppercase mb-8">Histórico de Vagas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vagasSalvas.map((vaga) => (
              <div
                key={vaga.id}
                className="bg-white p-5 rounded-2xl shadow-md border-t-8 flex flex-col justify-between group relative transition-all hover:shadow-xl"
                style={{ borderColor: vaga.cor }}
              >
                {/* BOTÃO LIXEIRA */}
                <button
                  onClick={(e) => { e.stopPropagation(); excluirVaga(vaga.id); }}
                  className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>
                </button>

                <div>
                  <h3 className="font-bold text-gray-800 uppercase text-sm mb-1 line-clamp-1">{vaga.titulo}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{vaga.empresa}</p>
                </div>

                <button
                  onClick={() => {
                    setTitulo(vaga.titulo); setEmpresa(vaga.empresa); setSubtitulo(vaga.subtitulo);
                    setEmail(vaga.email); setRequisitos(vaga.requisitos.join("\n"));
                    setCor(vaga.cor); setLogo(vaga.logoUrl); setFoto(vaga.imagemUrl);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 w-full py-2 bg-zinc-100 group-hover:bg-red-900 group-hover:text-white text-gray-500 text-[10px] font-black rounded-lg transition-all"
                >
                  RE-EDITAR
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}