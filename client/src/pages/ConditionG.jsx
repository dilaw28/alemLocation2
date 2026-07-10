import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ConditionG() {
  return (
    <>
      <Navbar />

      <style>
        {`
          .condition-page {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1.5rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            line-height: 1.7;
          }

          .condition-page h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #0f172a;
            border-bottom: 4px solid #f97316;
            display: inline-block;
            padding-bottom: 0.5rem;
          }

          .condition-page h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1.2rem;
            color: #0f172a;
            border-left: 5px solid #f97316;
            padding-left: 1rem;
          }

          .condition-page h3 {
            font-size: 1.3rem;
            font-weight: 500;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #334155;
          }

          .condition-page p {
            margin-bottom: 1rem;
          }

          .condition-page ul,
          .condition-page ol {
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .condition-page ul {
            list-style-type: disc;
          }

          .condition-page ol {
            list-style-type: decimal;
          }

          .condition-page li {
            margin-bottom: 0.5rem;
          }

          .condition-page section {
            background: #ffffff;
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s ease;
          }

          .condition-page section:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .condition-page .intro {
            margin-bottom: 2.5rem;
            color: #475569;
            font-size: 1.1rem;
          }

          .condition-page .sub-list {
            margin-top: 0.5rem;
            margin-bottom: 1rem;
          }

          @media (max-width: 600px) {
            .condition-page {
              margin: 1rem auto;
              padding: 0 1rem;
            }

            .condition-page h1 {
              font-size: 2rem;
            }

            .condition-page h2 {
              font-size: 1.5rem;
            }

            .condition-page section {
              padding: 1rem 1.2rem;
            }
          }
        `}
      </style>

      <div className="condition-page" style={{ paddingTop: '6rem' }}>
        <h1>Conditions Générales de Location de Voiture ALEM</h1>

        <p className="intro">
          Les présentes conditions générales définissent les règles de location
          des véhicules proposés par ALEM. Toute réservation ou location
          implique l'acceptation sans réserve des dispositions ci-dessous.
        </p>

        <section>
          <h2>1. Conditions Générales</h2>

          <ol>
            <li>
              Le client doit être âgé d'au moins 25 ans et posséder un permis
              de conduire valide depuis plus de deux (2) ans.
            </li>
            <li>
              Il doit également présenter :
              <ul className="sub-list">
                <li>Son permis de conduire en cours de validité.</li>
                <li>Une caution selon la valeur du véhicule.</li>
                <li>Son passeport en cours de validité.</li>
                <li>Le montant de la location en intégralité.</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2>2. Conditions relatives à l’utilisation du véhicule</h2>

          <ol>
            <li>
              Le véhicule est remis au client en état de marche avec les
              documents suivants : contrat, assurance, copie légalisée de la
              carte grise, vignette, copie de RC et de CF.
            </li>
            <li>
              Le client doit restituer le véhicule comme constaté au départ (la
              fiche constat faisant foi). En cas de discordance entre l’état du
              véhicule au départ et celui de sa restitution, le client
              supportera les frais de réparation, surtout lorsque la panne
              résulte d’un usage anormal du véhicule (en cas de panne, les
              réparations ne pourront avoir lieu qu’après accord de l’agence
              ALEM).
            </li>
            <li>
              Le véhicule ne doit pas être conduit par une tierce personne autre
              que le client. En cas de problème, ce dernier prend l’entière
              responsabilité.
            </li>
            <li>
              Le client ne doit pas utiliser le véhicule à des fins illicites,
              pour le transport de marchandises ni pour des compétitions
              sportives.
            </li>
            <li>
              Le client est seul responsable des infractions et amendes reçues
              durant la location.
            </li>
            <li>
              Toute détérioration d’accessoires à l’intérieur du véhicule est à
              la charge du client.
            </li>
            <li>
              Le client doit contrôler l’état du véhicule avant la signature du
              contrat (niveau huile, niveau d’eau, accessoires pneumatiques,
              état de propreté, indicateurs et feux). Toute panne ou amende
              résultant de la négligence de ces recommandations entraînera la
              responsabilité du client.
            </li>
            <li>
              Le client doit remettre le véhicule avec un plein (gasoil,
              essence, sans plomb, normale).
            </li>
          </ol>
        </section>

        <section>
          <h2>3. Conditions relatives à la durée de location</h2>

          <ol>
            <li>
              Le forfait journalier de location est de 24 h pour 300 km/jour. Si
              le client souhaite prolonger la durée de location au-delà de 24 h,
              il devra obligatoirement demander l’autorisation à l’agence ALEM
              douze (12) heures avant la restitution du véhicule.
            </li>
            <li>
              Le client doit restituer les documents et les clés du véhicule.
              Dans le cas contraire, le véhicule sera considéré comme non rendu
              jusqu’à production d’un récépissé de dépôt de vol par l’autorité
              de police dans les 24 h.
            </li>
            <li>
              Toute immobilisation sera considérée comme location et facturée au
              prix défini par le contrat.
            </li>
          </ol>
        </section>

        <section>
          <h2>4. Conditions relatives en cas d’accident</h2>

          <p>
            Tous nos véhicules disposent d’une assurance standard conforme à la
            réglementation en vigueur. En cas d’incident, le client s’engage à
            remplir le constat amiable de manière lisible et précise. Les frais
            de dépannage, de remorquage ainsi que les réparations du véhicule
            restent à la charge du client, tout comme les frais d’immobilisation
            calculés selon le tarif de location en vigueur. Les coûts et la
            durée des réparations sont également supportés par le client, qu’il
            soit responsable ou non de l’incident. Par ailleurs, l’assurance
            tous risques n’est pas incluse automatiquement et peut être délivrée
            uniquement sur demande préalable, sous réserve d’acceptation, avec
            application de tarifs complémentaires.
          </p>

          <p style={{ fontWeight: 600, marginTop: '1rem' }}>
            Des poursuites pénales seront engagées et une procédure sera
            introduite auprès des autorités compétentes si le client :
          </p>

          <ul>
            <li>Conduit en état d’ivresse.</li>
            <li>Est arrêté en état d’ivresse.</li>
            <li>
              Laisse le véhicule conduit par une tierce personne autre que le
              client.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Conditions relatives en cas de vol</h2>

          <ol>
            <li>
              En cas de vol, le client doit immédiatement contacter l’agence
              ALEM et signaler auprès des autorités compétentes (gendarmerie ou
              police) pour établir les documents relatifs à l’assurance et à
              l’enquête de police.
            </li>
            <li>
              L’assurance n’intervient pas en cas de vol du véhicule ou des
              accessoires engageant la responsabilité du client ou de ses ayants
              droit. Dès le contrat établi, des poursuites pénales seront
              engagées et une procédure sera introduite auprès des autorités
              compétentes.
            </li>
          </ol>
        </section>

        <section>
          <h2>6. Conditions financières</h2>

          <ol>
            <li>
              La caution sera restituée au client à la fin de la location quand
              toutes les formalités seront réglées.
            </li>
            <li>
              Lorsque le forfait journalier de 300 km/jour est dépassé, le
              client devra payer la différence du kilométrage.
            </li>
            <li>
              Lorsque le client accuse un retard d’une heure, le client devra
              payer une demi‑journée.
            </li>
            <li>
              Le client devra payer 1 000 DA si le véhicule est rendu dans un
              état de saleté important.
            </li>
          </ol>
        </section>
      </div>

      <Footer />
    </>
  );
}