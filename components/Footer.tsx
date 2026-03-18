"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const footerLinks = {
  tienda: [
    { href: "/catalogo", label: "Todos los productos" },
    { href: "/colecciones", label: "Colecciones" },
    { href: "/novedades", label: "Novedades" },
    { href: "/ofertas", label: "Ofertas" },
  ],
  empresa: [
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
    { href: "/tiendas", label: "Tiendas físicas" },
    { href: "/trabaja-con-nosotros", label: "Trabaja con nosotros" },
  ],
  ayuda: [
    { href: "/envios", label: "Envíos" },
    { href: "/devoluciones", label: "Devoluciones" },
    { href: "/tallas", label: "Guía de tallas" },
    { href: "/faq", label: "Preguntas frecuentes" },
  ],
};

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://tiktok.com", label: "Tiktok", icon: TikTokIcon },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del logo y newsletter
      gsap.fromTo(
        topSectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: topSectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animación de las columnas de links
      const columns = columnsRef.current?.querySelectorAll(".footer-column");
      if (columns) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: columnsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animación del bottom
      gsap.fromTo(
        bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white">
      {/* Sección superior: Logo + Newsletter */}
      <div
        ref={topSectionRef}
        className="container-fiver py-16 lg:py-20 border-b border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Logo y descripción */}
          <div>
            <Link
              href="/"
              className="font-oswald text-3xl lg:text-4xl font-bold tracking-wider inline-block mb-6 hover:opacity-70 transition-opacity duration-300"
            >
              FIVER
            </Link>
            <p className="font-inter text-white/60 text-base leading-relaxed max-w-md">
              Esenciales minimalistas para quienes valoran la simplicidad. 
              Diseño intencional, calidad duradera.
            </p>
          </div>

          {/* Newsletter */}
          <div className="lg:text-right">
            <h3 className="font-oswald text-lg font-semibold tracking-wide mb-4">
              Newsletter
            </h3>
            <p className="font-inter text-white/60 text-sm mb-6">
              Suscríbete para recibir novedades y ofertas exclusivas.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Sección media: Links de navegación */}
      <div
        ref={columnsRef}
        className="container-fiver py-12 lg:py-16 border-b border-white/10"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna: Tienda */}
          <div className="footer-column">
            <h4 className="font-oswald text-sm font-semibold tracking-wide uppercase mb-6">
              Tienda
            </h4>
            <ul className="space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna: Empresa */}
          <div className="footer-column">
            <h4 className="font-oswald text-sm font-semibold tracking-wide uppercase mb-6">
              Empresa
            </h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna: Ayuda */}
          <div className="footer-column">
            <h4 className="font-oswald text-sm font-semibold tracking-wide uppercase mb-6">
              Ayuda
            </h4>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna: Redes sociales */}
          <div className="footer-column col-span-2 md:col-span-1">
            <h4 className="font-oswald text-sm font-semibold tracking-wide uppercase mb-6">
              Seguínos
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección inferior: Copyright y legales */}
      <div ref={bottomRef} className="container-fiver py-6 lg:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-inter text-xs text-white/40">
            © {new Date().getFullYear()} FIVER. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacidad"
              className="font-inter text-xs text-white/40 hover:text-white/70 transition-colors duration-300"
            >
              Política de privacidad
            </Link>
            <Link
              href="/terminos"
              className="font-inter text-xs text-white/40 hover:text-white/70 transition-colors duration-300"
            >
              Términos y condiciones
            </Link>
            <Link
              href="/cookies"
              className="font-inter text-xs text-white/40 hover:text-white/70 transition-colors duration-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componente del formulario de newsletter
function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 lg:justify-end"
    >
      <input
        type="email"
        placeholder="Tu correo electrónico"
        required
        className="w-full sm:w-64 px-4 py-3 bg-white/5 border border-white/20 rounded-none text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors duration-300"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-black font-inter text-sm font-medium hover:bg-white/90 transition-colors duration-300 cursor-pointer"
      >
        Suscribirse
      </button>
    </form>
  );
}

// Iconos de redes sociales
function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-5 h-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
 
function TikTokIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}