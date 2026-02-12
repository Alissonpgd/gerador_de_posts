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
  // --- ESTADOS (A Memória do seu Formulário) ---
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

  // --- LÓGICA DE IMAGEM (Conversão para Base64) ---
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
    if (!titulo || !empresa) {
      alert("Por favor, preencha o título e a empresa antes de salvar.");
      return;
    }
    try {
      const dados = {
        titulo, empresa, subtitulo, email, cor, logoUrl: logo, imagemUrl: foto,
        requisitos: requisitos.split("\n").filter(r => r !== ""),
        criadoEm: serverTimestamp()
      };
      await addDoc(collection(db, "vagas"), dados);
      alert("Vaga salva com sucesso na nuvem! ✅");
      buscarVagas();
    } catch (e) { alert("Erro ao salvar."); }
  };

  // --- EXCLUIR VAGA (DELETE) ---
  const excluirVaga = async (id: string) => {
    if (window.confirm("Deseja realmente apagar esta vaga do histórico?")) {
      try {
        await deleteDoc(doc(db, "vagas", id));
        setVagasSalvas(vagasSalvas.filter(v => v.id !== id));
      } catch (e) { alert("Erro ao excluir."); }
    }
  };

  // --- DOWNLOAD PNG ---
  const downloadImage = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `vaga-${empresa || 'rh-conecta'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-200 p-4 md:p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* SEÇÃO SUPERIOR: GERADOR (FORMULÁRIO + PREVIEW) */}
        <div className="flex flex-col lg:flex-row gap-8 w-full items-start">

          {/* PAINEL ESQUERDO: CONFIGURAÇÃO */}
          <section className="w-full lg:w-[400px] bg-white p-6 rounded-2xl shadow-xl space-y-5 sticky top-8">
            <header className="border-b pb-3 mb-4 text-red-900 font-black italic">
              <h1 className="text-2xl leading-none uppercase">RH Conecta Vaga</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Gerador Profissional</p>
            </header>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Cargo / Vaga</label>
                <input className="border-2 p-2 rounded-lg text-sm outline-none focus:border-red-800 transition-all" value={titulo} onChange={e => setTitulo(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Subtitulo (ex: com experiência)</label>
                <input className="border-2 p-2 rounded-lg text-sm outline-none focus:border-red-800 transition-all" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Nome da Empresa</label>
                <input className="border-2 p-2 rounded-lg text-sm outline-none focus:border-red-800 transition-all" value={empresa} onChange={e => setEmpresa(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Email de Contato</label>
                <input className="border-2 p-2 rounded-lg text-sm outline-none focus:border-red-800 transition-all font-bold" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Requisitos e Benefícios</label>
                <textarea className="border-2 p-2 rounded-lg h-24 text-sm outline-none focus:border-red-800 transition-all" value={requisitos} onChange={e => setRequisitos(e.target.value)} />
              </div>

              {/* ÁREA DE UPLOADS ESTILIZADA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase italic">Logo</label>
                  <label htmlFor="logo-input" className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center bg-gray-50 hover:border-red-800 hover:bg-red-50 transition-all overflow-hidden group">
                    {logo ? (
                      <img src={logo} alt="Preview Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-red-800">
                        <span className="text-2xl mb-1">🏢</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter">Subir Logo</span>
                      </div>
                    )}
                  </label>
                  <input id="logo-input" type="file" accept="image/*" onChange={e => handleImageChange(e, 'logo')} className="hidden" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase italic">Foto Fundo</label>
                  <label htmlFor="foto-input" className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center bg-gray-50 hover:border-red-800 hover:bg-red-50 transition-all overflow-hidden group">
                    {foto ? (
                      <img src={foto} alt="Preview Fundo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-red-800">
                        <span className="text-2xl mb-1">📸</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter">Foto Fundo</span>
                      </div>
                    )}
                  </label>
                  <input id="foto-input" type="file" accept="image/*" onChange={e => handleImageChange(e, 'foto')} className="hidden" />
                </div>
              </div>

              {/* SELETOR DE COR */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Cor Principal</label>
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                  <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-12 h-10 cursor-pointer rounded border-none bg-transparent" />
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase">{cor}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button onClick={downloadImage} className="bg-red-900 text-white py-3 rounded-full font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-red-800 transition-all active:scale-95">Baixar PNG</button>
              <button onClick={salvarVaga} className="bg-zinc-800 text-white py-3 rounded-full font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                <span>💾</span> Salvar na Nuvem
              </button>
            </div>
          </section>

          {/* PAINEL DIREITO: PREVIEW DO POST */}
          <section className="flex-1 flex flex-col items-center">
            <div className="mb-4">
              <span className="bg-white px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">Preview Real</span>
            </div>
            <div ref={cardRef} className="bg-white shadow-2xl rounded-sm">
              <VagaCard
                titulo={titulo} nomeEmpresa={empresa} subtitulo={subtitulo}
                requisitos={requisitos.split("\n").filter(r => r !== "")}
                emailContato={email} logoUrl={logo} imagemUrl={foto} corPrincipal={cor}
              />
            </div>
          </section>
        </div>

        {/* SEÇÃO INFERIOR: HISTÓRICO DE VAGAS */}
        <section className="w-full border-t border-zinc-300 pt-10 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-gray-800 italic uppercase leading-none">Histórico de Vagas</h2>
            <div className="flex-1 h-[2px] bg-zinc-300"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vagasSalvas.map((vaga) => (
              <div
                key={vaga.id}
                className="bg-white p-5 rounded-2xl shadow-md border-t-8 flex flex-col justify-between group relative transition-all hover:shadow-xl"
                style={{ borderColor: vaga.cor }}
              >
                {/* BOTÃO EXCLUIR (LIXEIRA) */}
                <button
                  onClick={(e) => { e.stopPropagation(); excluirVaga(vaga.id); }}
                  className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  title="Excluir do Histórico"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>
                </button>

                <div>
                  <h3 className="font-bold text-gray-800 uppercase text-sm mb-1 line-clamp-2">{vaga.titulo}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{vaga.empresa}</p>
                </div>

                <button
                  onClick={() => {
                    setTitulo(vaga.titulo); setEmpresa(vaga.empresa); setSubtitulo(vaga.subtitulo);
                    setEmail(vaga.email); setRequisitos(vaga.requisitos.join("\n"));
                    setCor(vaga.cor); setLogo(vaga.logoUrl); setFoto(vaga.imagemUrl);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 w-full py-2 bg-zinc-100 group-hover:bg-red-900 group-hover:text-white text-gray-500 text-[10px] font-black rounded-lg transition-all uppercase tracking-tighter"
                >
                  Re-editar vaga
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}