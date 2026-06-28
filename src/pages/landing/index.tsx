import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  Calendar,
  Users,
  ClipboardList,
  Package,
  BarChart2,
  Shield,
  CheckCircle,
  Menu,
  X,
  HeartPulse,
  Headphones,
  ArrowRight,
  Star,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Calendar,
    title: 'Agenda inteligente',
    description:
      'Programa citas, confirma con un clic y lleva un registro automático de intentos de contacto. Nunca pierdas un turno.',
  },
  {
    icon: Users,
    title: 'Ficha de paciente completa',
    description:
      'Historial clínico, datos personales, diagnósticos y próxima cita en un solo lugar. Acceso instantáneo en cada consulta.',
  },
  {
    icon: ClipboardList,
    title: 'Controles médicos',
    description:
      'Registra audiogramas, hallazgos clínicos y seguimiento post-consulta. Compatible con múltiples especialidades.',
  },
  {
    icon: Package,
    title: 'Inventario de audífonos',
    description:
      'Gestiona stock, garantías y vencimientos de dispositivos. Vincula cada producto al paciente correspondiente.',
  },
  {
    icon: BarChart2,
    title: 'Dashboard en tiempo real',
    description:
      'Citas del día, pacientes atendidos esta semana y alertas de confirmación pendiente de un vistazo.',
  },
  {
    icon: Shield,
    title: 'Multi-tenant seguro',
    description:
      'Cada clínica tiene su propio espacio aislado. JWT con sesiones de una hora y guards de seguridad en cada ruta.',
  },
];

const SPECIALTIES = [
  { icon: Headphones, label: 'Audiología' },
  { icon: HeartPulse, label: 'Medicina General' },
  { icon: ClipboardList, label: 'Especialidades en expansión' },
];

const TESTIMONIALS = [
  {
    quote:
      'Antes llevábamos las citas en papel. Ahora confirmamos y reagendamos desde el celular en segundos.',
    author: 'Dra. Valeria Ríos',
    role: 'Audióloga, Quito',
    rating: 5,
  },
  {
    quote:
      'El historial de audiogramas integrado nos ahorra 20 minutos por consulta. Imprescindible.',
    author: 'Dr. Marcos Fuentes',
    role: 'Otorrinolaringólogo, Guayaquil',
    rating: 5,
  },
  {
    quote:
      'La gestión de inventario de audífonos es exactamente lo que necesitábamos. Simple y potente.',
    author: 'Lcda. Carmen Alvarado',
    role: 'Coordinadora clínica, Cuenca',
    rating: 5,
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mes',
    description: 'Para clínicas pequeñas que inician su digitalización.',
    features: ['Hasta 3 usuarios', '500 pacientes', 'Agenda y controles', 'Soporte por email'],
    highlighted: false,
    cta: 'Empezar gratis',
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mes',
    description: 'El plan completo para clínicas en crecimiento.',
    features: [
      'Usuarios ilimitados',
      'Pacientes ilimitados',
      'Todo Starter',
      'Inventario de dispositivos',
      'Reportes PDF',
      'Soporte prioritario',
    ],
    highlighted: true,
    cta: 'Probar 14 días gratis',
  },
  {
    name: 'Enterprise',
    price: 'A medida',
    period: '',
    description: 'Para redes de clínicas y hospitales.',
    features: [
      'Multi-sede',
      'Integraciones personalizadas',
      'SLA garantizado',
      'Onboarding dedicado',
    ],
    highlighted: false,
    cta: 'Contactar ventas',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Zynka — Software médico para clínicas de audiología</title>
        <meta
          name="description"
          content="Gestiona citas, pacientes, controles médicos e inventario de audífonos desde una sola plataforma. Diseñado para clínicas de audiología."
        />
      </Head>

      <div className="min-h-screen bg-white font-sans text-gray-900">
        {/* ── NAV ── */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#1E3A8A] tracking-tight">Zynka</span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <li><a href="#funcionalidades" className="hover:text-[#1E3A8A] transition-colors">Funcionalidades</a></li>
              <li><a href="#especialidades" className="hover:text-[#1E3A8A] transition-colors">Especialidades</a></li>
              <li><a href="#testimonios" className="hover:text-[#1E3A8A] transition-colors">Testimonios</a></li>
              <li><a href="#precios" className="hover:text-[#1E3A8A] transition-colors">Precios</a></li>
            </ul>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-[#1E3A8A] transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-[#1E3A8A] text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition-colors"
              >
                Comenzar gratis
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
              <a href="#funcionalidades" onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
              <a href="#especialidades" onClick={() => setMobileMenuOpen(false)}>Especialidades</a>
              <a href="#testimonios" onClick={() => setMobileMenuOpen(false)}>Testimonios</a>
              <a href="#precios" onClick={() => setMobileMenuOpen(false)}>Precios</a>
              <hr className="border-gray-100" />
              <Link href="/login" className="text-gray-700">Iniciar sesión</Link>
              <Link
                href="/register"
                className="bg-[#1E3A8A] text-white text-center py-2 rounded-xl font-semibold"
              >
                Comenzar gratis
              </Link>
            </div>
          )}
        </header>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-white to-[#F0F9FF] py-20 sm:py-28">
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-100 rounded-full opacity-50 blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block mb-4 bg-blue-100 text-[#1E3A8A] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
              Software médico SaaS
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              La clínica de audiología<br />
              <span className="text-[#1E3A8A]">sin papel, sin caos.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Zynka centraliza citas, historial clínico, audiogramas e inventario de audífonos en
              una sola plataforma pensada para el médico, no para el administrador.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-blue-800 transition-colors text-base"
              >
                Empezar gratis <ArrowRight size={18} />
              </Link>
              <a
                href="#funcionalidades"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-7 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-base"
              >
                Ver funcionalidades
              </a>
            </div>
            <p className="mt-5 text-xs text-gray-400">
              14 días gratis · Sin tarjeta de crédito · Cancela cuando quieras
            </p>
          </div>
        </section>

        {/* ── SOCIAL PROOF STRIP ── */}
        <section className="bg-[#1E3A8A] py-5 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 text-white/80 text-sm font-medium">
            <span>✓ Más de 50 clínicas activas</span>
            <span>✓ +10 000 pacientes registrados</span>
            <span>✓ Disponible en toda Latinoamérica</span>
            <span>✓ HIPAA-ready</span>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="funcionalidades" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Todo lo que tu clínica necesita
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Diseñado junto a médicos audiólogos para cubrir cada etapa del flujo clínico.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:border-blue-100 transition-all duration-200"
                >
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#1E3A8A] transition-colors duration-200">
                    <Icon
                      size={22}
                      className="text-[#1E3A8A] group-hover:text-white transition-colors duration-200"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-20 sm:py-24 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Del turno al alta en 4 pasos
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Un flujo diseñado para que el médico se concentre en el paciente, no en el
                software.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Agenda la cita', text: 'Selecciona paciente, tipo de servicio y horario. El sistema registra el intento de contacto automáticamente.' },
                { step: '02', title: 'Confirma el turno', text: 'Un clic convierte la cita tentativa en confirmada y notifica al paciente por WhatsApp o email.' },
                { step: '03', title: 'Registra el control', text: 'Audiograma, hallazgos clínicos y seguimiento quedas guardados en el historial del paciente.' },
                { step: '04', title: 'Agenda el seguimiento', text: 'Con un clic se genera la próxima cita o el control de garantía del audífono.' },
              ].map(({ step, title, text }) => (
                <div key={step} className="relative bg-white border border-gray-100 rounded-2xl p-6">
                  <span className="text-5xl font-black text-blue-50 leading-none">{step}</span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECIALTIES ── */}
        <section id="especialidades" className="py-20 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Especialidades soportadas
            </h2>
            <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
              Zynka nació en audiología y se expande a nuevas especialidades médicas con el mismo
              modelo de datos flexible.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {SPECIALTIES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 bg-blue-50 rounded-2xl px-10 py-8 min-w-[160px]"
                >
                  <Icon size={32} className="text-[#1E3A8A]" />
                  <span className="font-semibold text-gray-800 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonios" className="py-20 sm:py-28 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Lo que dicen nuestros médicos
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ quote, author, role, rating }) => (
                <div key={author} className="bg-white border border-gray-100 rounded-2xl p-7 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{author}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="precios" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Planes simples, sin sorpresas
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Empieza gratis. Crece con nosotros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {PLANS.map(({ name, price, period, description, features, highlighted, cta }) => (
                <div
                  key={name}
                  className={`rounded-2xl p-8 flex flex-col gap-6 border transition-all ${
                    highlighted
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-xl scale-[1.02]'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  {highlighted && (
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full w-fit">
                      Más popular
                    </span>
                  )}
                  <div>
                    <h3
                      className={`text-xl font-extrabold mb-1 ${highlighted ? 'text-white' : 'text-gray-900'}`}
                    >
                      {name}
                    </h3>
                    <p className={`text-sm ${highlighted ? 'text-blue-200' : 'text-gray-400'}`}>
                      {description}
                    </p>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black ${highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {price}
                    </span>
                    <span className={`text-sm mb-1 ${highlighted ? 'text-blue-200' : 'text-gray-400'}`}>
                      {period}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          size={16}
                          className={`mt-0.5 shrink-0 ${highlighted ? 'text-blue-300' : 'text-[#1E3A8A]'}`}
                        />
                        <span className={highlighted ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`text-center text-sm font-semibold py-3 rounded-xl transition-colors ${
                      highlighted
                        ? 'bg-white text-[#1E3A8A] hover:bg-blue-50'
                        : 'bg-[#1E3A8A] text-white hover:bg-blue-800'
                    }`}
                  >
                    {cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-20 sm:py-28 bg-gradient-to-br from-[#1E3A8A] to-blue-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5">
              Tu clínica merece tecnología de nivel hospitalario.
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
              Regístrate hoy y en 5 minutos tienes tu primera cita agendada.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1E3A8A] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors text-base"
            >
              Comenzar gratis <ArrowRight size={18} />
            </Link>
            <p className="mt-4 text-blue-300 text-xs">
              Sin tarjeta de crédito · Soporte en español
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <span className="text-white text-xl font-black">Zynka</span>
              <p className="mt-3 text-sm leading-relaxed">
                Software médico SaaS para clínicas de audiología y especialidades afines en
                Latinoamérica.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Producto</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#precios" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#especialidades" className="hover:text-white transition-colors">Especialidades</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Empresa</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Quiénes somos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-xs">
            © {new Date().getFullYear()} Zynka. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </>
  );
}
