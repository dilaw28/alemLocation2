import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Politique() {
  return (
    <>
      <Navbar />

      <style>
        {`
          .politique-page {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1.5rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.7;
          }

          .politique-page h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #0f172a;
            border-bottom: 4px solid #f97316;
            display: inline-block;
            padding-bottom: 0.5rem;
          }

          .politique-page h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            color: #0f172a;
            border-left: 5px solid #f97316;
            padding-left: 1rem;
          }

          .politique-page p {
            margin-bottom: 1rem;
          }

          .politique-page ul {
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
            list-style-type: disc;
          }

          .politique-page li {
            margin-bottom: 0.5rem;
          }

          .politique-page section {
            background: #ffffff;
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s ease;
          }

          .politique-page section:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .politique-page .intro {
            margin-bottom: 2.5rem;
            color: #475569;
            font-size: 1.1rem;
          }

          @media (max-width: 600px) {
            .politique-page {
              margin: 1rem auto;
              padding: 0 1rem;
            }

            .politique-page h1 {
              font-size: 2rem;
            }

            .politique-page h2 {
              font-size: 1.5rem;
            }

            .politique-page section {
              padding: 1rem 1.2rem;
            }
          }
        `}
      </style>

      <div className="politique-page" style={{ paddingTop: '6rem' }}>
        <h1>Politique de confidentialité – ALEM Cars</h1>

        <p className="intro">
          Le site ALEM Cars s’engage à respecter la vie privée de ses utilisateurs
          et à protéger avec la plus grande rigueur les données personnelles
          collectées lors de l’utilisation de ses services de location de
          véhicules. La transparence et la sécurité sont au cœur de nos
          engagements.
        </p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Le site ALEM Cars s’engage à respecter la vie privée de ses
            utilisateurs et à protéger avec la plus grande rigueur les données
            personnelles collectées lors de l’utilisation de ses services de
            location de véhicules. La transparence et la sécurité sont au cœur de
            nos engagements.
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>
            Dans le cadre de l’utilisation de nos services, nous pouvons être
            amenés à collecter certaines informations personnelles, notamment :
          </p>
          <ul>
            <li>Nom et prénom</li>
            <li>Numéro de téléphone</li>
            <li>Adresse e-mail (si fournie)</li>
            <li>
              Informations liées aux réservations : dates, durée, véhicule choisi
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation des données</h2>
          <p>
            Les données personnelles collectées sont utilisées exclusivement pour
            la gestion des réservations, la communication avec les clients, le
            suivi des demandes ainsi que l’amélioration continue de nos services
            afin d’offrir une meilleure expérience utilisateur.
          </p>
        </section>

        <section>
          <h2>4. Partage des données</h2>
          <p>
            Les données personnelles ne font l’objet d’aucune vente ni d’aucun
            partage à des fins commerciales. Elles peuvent uniquement être
            transmises aux autorités compétentes si la loi l’exige.
          </p>
        </section>

        <section>
          <h2>5. Conservation des données</h2>
          <p>
            Les données sont conservées uniquement pendant la durée nécessaire à
            la gestion des services de location. Une fois cette durée dépassée,
            elles sont supprimées ou archivées de manière sécurisée conformément
            aux bonnes pratiques.
          </p>
        </section>

        <section>
          <h2>6. Sécurité des données</h2>
          <p>
            ALEM Cars met en place des mesures techniques et organisationnelles
            appropriées afin de protéger les données personnelles contre tout
            accès non autorisé, toute perte, altération ou utilisation abusive.
          </p>
        </section>

        <section>
          <h2>7. Cookies</h2>
          <p>
            Le site peut utiliser des cookies afin d’améliorer la navigation,
            analyser le trafic et optimiser l’expérience utilisateur.
            L’utilisateur conserve la possibilité de désactiver les cookies via
            les paramètres de son navigateur.
          </p>
        </section>

        <section>
          <h2>8. Droits de l’utilisateur</h2>
          <p>
            Conformément aux bonnes pratiques en matière de protection des
            données, chaque utilisateur dispose du droit d’accès, de
            rectification et de suppression de ses données personnelles en
            formulant une demande auprès de notre service.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Pour toute question relative à la protection des données
            personnelles, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Par téléphone : 0550203914</li>
            <li>
              À l’adresse : Local N01, lotissement nord, Draa El Mizan, Algérie
            </li>
          </ul>
        </section>
      </div>

      <Footer />
    </>
  );
}