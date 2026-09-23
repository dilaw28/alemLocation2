


import "./whatb.css"


const WhatsAppButton = () => {
  const phoneNumber = "213781257070";
  const message = "Bonjour, je souhaite avoir plus d'informations.";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappURL}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter notre service sur WhatsApp"
      title="Contactez-nous sur WhatsApp"
    >
    < img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="WhatsApp" className="whatsapp-float " />
    </a>
    
  );
};

export default WhatsAppButton;