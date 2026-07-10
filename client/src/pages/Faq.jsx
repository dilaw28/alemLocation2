import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Faq() {
  return (
    <div>
      <Navbar />

      <style>
        {`
          .faq-page {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1.5rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.7;
          }

          .faq-page h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #0f172a;
            border-bottom: 4px solid #f97316;
            display: inline-block;
            padding-bottom: 0.5rem;
          }

          .faq-page h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            color: #0f172a;
            border-left: 5px solid #f97316;
            padding-left: 1rem;
          }

          .faq-page h3 {
            font-size: 1.3rem;
            font-weight: 500;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #334155;
          }

          .faq-page p {
            margin-bottom: 1rem;
          }

          .faq-page ul {
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
            list-style-type: disc;
          }

          .faq-page li {
            margin-bottom: 0.5rem;
          }

          .faq-page section {
            background: #ffffff;
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s ease;
          }

          .faq-page section:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .faq-page article {
            margin-bottom: 1.8rem;
            padding-bottom: 1.2rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .faq-page article:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          .faq-page .contact-list {
            list-style: none;
            padding-left: 0;
          }

          .faq-page .contact-list li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.1rem;
            padding: 0.5rem 0;
          }

          .faq-page .contact-list li::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #f97316;
            border-radius: 50%;
          }

          @media (max-width: 600px) {
            .faq-page {
              margin: 1rem auto;
              padding: 0 1rem;
            }

            .faq-page h1 {
              font-size: 2rem;
            }

            .faq-page h2 {
              font-size: 1.5rem;
            }

            .faq-page section {
              padding: 1rem 1.2rem;
            }
          }

          .highlight-icon {
            font-size: 1.5rem;
            margin-right: 0.5rem;
          }
        `}
      </style>

      <main className="faq-page">
        <h1> FAQ</h1>

        <section>
          <h2>1. Assistance client – Aide</h2>

          <article>
            <h3>
              <span className="highlight-icon"></span> Réservation d’un
              véhicule
            </h3>
            <p>
              La réservation d’un véhicule chez ALEM CARS Location se fait en
              toute simplicité :
            </p>
            <ul>
              <li>Choisissez le véhicule souhaité sur notre plateforme</li>
              <li>
                Remplissez le formulaire de réservation avec vos informations
                exactes
              </li>
              <li>Validez votre demande de réservation</li>
              <li>
                Notre équipe vous contacte rapidement pour confirmation et
                disponibilité
              </li>
            </ul>
          </article>

          <article>
            <h3>
              <span className="highlight-icon">📑</span> Conditions et documents
              requis
            </h3>
            <p>Pour toute location, le client doit obligatoirement fournir :</p>
            <ul>
              <li>
                Un permis de conduire valide correspondant à la catégorie du
                véhicule
              </li>
              <li>
                Une pièce d’identité officielle : carte nationale ou passeport
              </li>
              <li>
                Une caution financière, dont le montant varie selon le véhicule
              </li>
            </ul>
          </article>

          <article>
            <h3>
              <span className="highlight-icon">💳</span> Modalités de paiement
            </h3>
            <p>
              Nous proposons des modalités de paiement simples, flexibles et
              sécurisées, incluant le paiement en espèces, le paiement par
              virement bancaire selon accord préalable, ainsi que le paiement à
              la prise du véhicule conformément aux conditions convenues lors de
              la réservation. Il est également possible de régler en euros.
            </p>
          </article>

          <article>
            <h3>
              <span className="highlight-icon"></span> Livraison et
              restitution des véhicules
            </h3>
            <p>
              Afin de garantir un service flexible et adapté à vos besoins, nous
              proposons :
            </p>
            <ul>
              <li>
                La livraison du véhicule à domicile selon la zone géographique
              </li>
              <li>Le retrait directement en agence</li>
              <li>
                Le retour du véhicule conformément aux conditions définies dans
                le contrat de location
              </li>
            </ul>
          </article>

          <article>
            <h3>
              <span className="highlight-icon">🔧</span> Assistance en cas de
              problème
            </h3>
            <p>En cas de panne ou d’incident durant la location :</p>
            <ul>
              <li>Contactez immédiatement notre service client</li>
              <li>
                Une assistance vous sera fournie dans les plus brefs délais
              </li>
              <li>
                Des solutions de remplacement peuvent être proposées selon la
                situation
              </li>
            </ul>
          </article>
        </section>

        <section>
          <h2>2. Questions fréquentes</h2>

          <article>
            <h3>❓ Comment puis-je réserver un véhicule ?</h3>
            <p>
              La réservation se fait en ligne via notre site. Il suffit de
              choisir un véhicule, remplir le formulaire et attendre la
              confirmation de disponibilité.
            </p>
          </article>

          <article>
            <h3>❓ Quel est l’âge minimum pour louer une voiture ?</h3>
            <p>
              Le conducteur doit être âgé d’au moins 25 ans et disposer d’un
              permis de conduire valide.
            </p>
          </article>

          <article>
            <h3>❓ Le carburant est-il inclus ?</h3>
            <p>
              Non. Le véhicule est livré avec un niveau de carburant initial et
              doit être restitué au même niveau.
            </p>
          </article>

          <article>
            <h3>❓ Une caution est-elle obligatoire ?</h3>
            <p>
              Oui. Une caution est exigée selon la catégorie et la valeur du
              véhicule loué.
            </p>
          </article>

          <article>
            <h3>❓ Puis-je annuler une réservation ?</h3>
            <p>
              Oui, l’annulation est possible avant la prise du véhicule, selon
              les conditions définies lors de la réservation.
            </p>
          </article>

          <article>
            <h3>❓ Les kilomètres sont-ils limités ?</h3>
            <p>
              Selon le contrat, certains véhicules disposent d’un kilométrage
              limité et d’autres en illimité.
            </p>
          </article>

          <article>
            <h3>❓ Puis-je récupérer la voiture à l’aéroport d’Alger ?</h3>
            <p>
              Oui, vous pouvez récupérer votre véhicule directement à
              l’aéroport d’Alger. La livraison est gratuite, quel que soit votre
              horaire d’arrivée. Notre équipe vous contactera à l’avance afin
              d’organiser une remise rapide, simple et sécurisée du véhicule dès
              votre arrivée.
            </p>
          </article>

          <article>
            <h3>❓ Proposez-vous la location longue durée ?</h3>
            <p>Oui, nous proposons des formules adaptées :</p>
            <ul>
              <li>Courte durée</li>
              <li>Moyenne durée</li>
              <li>Longue durée</li>
            </ul>
          </article>
        </section>

        <section>
          <h2>📞 Contact</h2>
          <p>Pour toute assistance :</p>
          <ul className="contact-list">
            <li>
              📱 Téléphone :<a href="tel:+213781257070">+213781257070</a>
              <br />
              <a href="tel:+213550203914">+213550203914</a>
            </li>
            <li>
              <a href="https://www.google.com/maps/place/Agence+de+location+de+v%C3%A9hicules+ALEM/@36.5356665,3.8363936,17.69z/data=!4m8!3m7!1s0x128c2d58c1e78603:0x11d4b834078c5e55!8m2!3d36.535475!4d3.8372069!9m1!1b1!16s%2Fg%2F11v4v6h7m3?entry=ttu&g_ep=EgoyMDI2MDYyMi4wIKXMDSoASAFQAw%3D%3D">
                📍 Adresse : cité de l'indépendance Draa El Mizan
              </a>
            </li>
            <li>⏰ Horaires : 08h00 – 20h00</li>
          </ul>
        </section>

        <section>
          <h2>⭐ ALEM Location de véhicules</h2>
          <p>Votre confort, notre priorité.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
