import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MentionL() {
  return (
    <>
      <Navbar />

      <style>
        {`
          .mention-page {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1.5rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.7;
          }

          .mention-page h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #0f172a;
            border-bottom: 4px solid #f97316;
            display: inline-block;
            padding-bottom: 0.5rem;
          }

          .mention-page h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            color: #0f172a;
            border-left: 5px solid #f97316;
            padding-left: 1rem;
          }

          .mention-page p {
            margin-bottom: 1rem;
          }

          .mention-page ul {
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
            list-style-type: disc;
          }

          .mention-page li {
            margin-bottom: 0.5rem;
          }

          .mention-page section {
            background: #ffffff;
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s ease;
          }

          .mention-page section:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .mention-page .intro {
            margin-bottom: 2.5rem;
            color: #475569;
            font-size: 1.1rem;
          }

          @media (max-width: 600px) {
            .mention-page {
              margin: 1rem auto;
              padding: 0 1rem;
            }

            .mention-page h1 {
              font-size: 2rem;
            }

            .mention-page h2 {
              font-size: 1.5rem;
            }

            .mention-page section {
              padding: 1rem 1.2rem;
            }
          }
        `}
      </style>

      <div className="mention-page" style={{ paddingTop: '6rem' }}>
        <h1>Mentions légales – ALEM Cars</h1>

        <p className="intro">
          Les présentes mentions légales régissent l’utilisation du site internet
          ALEM Cars. En naviguant sur ce site, vous acceptez les termes
          ci-dessous.
        </p>

        <section>
          <h2>1. Informations sur l’entreprise</h2>
          <ul>
            <li><strong>Nom de l’entreprise :</strong> ALEM Cars</li>
            <li><strong>Forme juridique :</strong> Auto-entrepreneur</li>
            <li><strong>Gérant :</strong> ALEM AMINE</li>
            <li><strong>Adresse :</strong> Local N01, lotissement nord Draa El Mizan, Algérie</li>
            <li><strong>Téléphone :</strong> 0550203914</li>
            <li><strong>RC :</strong> À compléter</li>
            <li><strong>NIF :</strong> À compléter</li>
          </ul>
        </section>

        <section>
          <h2>2. Hébergement du site</h2>
          <ul>
            <li><strong>Hébergeur :</strong> À compléter (ex : Hostinger, OVH)</li>
            <li><strong>Site web de l’hébergeur :</strong> À compléter</li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation du site</h2>
          <p>
            Le site ALEM Cars permet la réservation et la consultation des
            véhicules disponibles à la location. L’utilisateur accepte les
            conditions d’utilisation en naviguant sur le site.
          </p>
        </section>

        <section>
          <h2>4. Protection des données personnelles</h2>
          <p>
            Les données collectées (nom, téléphone, réservation) sont utilisées
            uniquement dans le cadre des services de location et ne sont jamais
            vendues ou partagées avec des tiers.
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            Le site peut utiliser des cookies afin d’améliorer l’expérience
            utilisateur et réaliser des statistiques de visite.
          </p>
        </section>

        <section>
          <h2>6. Responsabilité</h2>
          <p>
            Les informations présentes sur le site peuvent être modifiées à tout
            moment. Les photos des véhicules sont non contractuelles.
          </p>
        </section>

        <section>
          <h2>7. Location de véhicules</h2>
          <p>
            Toute réservation est soumise à la signature d’un contrat de
            location. Le conducteur doit être titulaire d’un permis valide. Une
            caution peut être demandée selon le véhicule.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}