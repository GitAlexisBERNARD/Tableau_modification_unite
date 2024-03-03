<template>
  <div>
    <h2 class="font-avenir text-center p-5">
      Calculateur de Répartition des Unités
    </h2>
    <div class="mb-6 ml-2">
      <label
        for="nouveauTotal"
        class="block mb-2 text-sm font-medium text-gray-900"
        >Nouveau Total:</label
      >
      <input
        class="ml-4 block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md w-[100px]"
        type="number"
        v-model.number="nouveauTotal"
        step="0.01"
      />
    </div>
  </div>
  <table class="min-w-full leading-normal">
    <thead>
      <tr>
        <th
          class="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          Début
        </th>
        <th
          class="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          Fin
        </th>
        <th
          class="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          U/h
        </th>
        <th
          class="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(tranche, index) in tranches"
        :key="index"
        class="border-b border-gray-300"
      >
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <select
            v-model="tranche.heureDebut"
            @change="ajusterHeureFinTranchePrecedente(index)"
            class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md w-full"
          >
            <option v-for="heure in heures" :value="heure" :key="heure">
              {{ heure }}
            </option>
          </select>
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <select
            v-model="tranche.heureFin"
            @change="mettreAJourHeuresDebut(index)"
            class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md w-full"
          >
            <option v-for="heure in heures" :value="heure" :key="heure">
              {{ heure }}
            </option>
          </select>
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <input
            type="number"
            v-model.number="tranche.taux"
            step="0.25"
            class="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md w-full"
          />
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <button
            @click="supprimerTranche(index)"
            class="text-red-600 hover:text-red-900 p-2 rounded-lg"
          >
            Supprimer
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="text-center p-4">
    <h3 class="font-bold">Total Actuel : {{ totalActuel.toFixed(2) }} U</h3>
  </div>
  <button
    @click="verifierTotal"
    class="text-white ml-4 bg-blue-600 p-2 rounded-xl"
  >
    Creation nouveau tableau des tranches
  </button>

  <div v-if="messageErreur" class="text-red-500">
    {{ messageErreur }}
  </div>
  <div v-if="tableauNouvellesTranches.length > 0" class="text-center p-4">
    <h3 class="font-bold">Nouveau Tableau des Tranches:</h3>
    <ul>
      <li v-for="(tranche, index) in formatterTranches()" :key="index">
        {{ tranche }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from "vue";

interface Tranche {
  heureDebut: string;
  heureFin: string;
  taux: number;
}

export default defineComponent({
  name: "CalculateurRepartition",
  setup() {
    const tranches = ref<Tranche[]>([
      {
        heureDebut: "00:00",
        heureFin: "00:00",
        taux: 0,
      },
    ]);
    const heures = ref(genererHeures());
    const messageErreur = ref("");
    const nouveauTotal = ref<number>(0);
    const tableauNouvellesTranches = ref<string[]>([]);
    function mettreAJourHeuresDebut(index: number) {
      console.log("Mise à jour des heures de début");
      nextTick(() => {
        if (index < tranches.value.length - 1) {
          const heureFinActuelle = tranches.value[index].heureFin;
          if (heureFinActuelle !== "00:00") {
            // Assurez-vous que ce n'est pas le début d'une nouvelle journée
            tranches.value[index + 1].heureDebut = heureFinActuelle;
          }
        }
      });
    }

    watch(
      tranches,
      (nouvellesTranches, anciennesTranches) => {
        console.log("watch");
        const derniereTranche = nouvellesTranches[nouvellesTranches.length - 1];
        if (derniereTranche && derniereTranche.heureFin !== "00:00") {
          console.log("watch if 1");
          ajouterTranche();
        }
      },
      { deep: true }
    );

    function genererHeures() {
      let heures = [];
      for (let i = 0; i < 24; i++) {
        heures.push(i.toString().padStart(2, "0") + ":00");
      }
      return heures;
    }
    function arrondirAuMultipleLePlusProche(
      nombre: number,
      multiple: number
    ): number {
      const inverse = 1 / multiple;
      return Math.round(nombre * inverse) / inverse;
    }

    function verifierTotal() {
      const derniereTranche = tranches.value[tranches.value.length - 1];
      if (derniereTranche.heureFin !== "00:00") {
        alert("L'heure de fin de la dernière tranche doit être 00:00.");
        return;
      }
      genererTableauTranches();
      ajusterTranchesAvecNouveauTotal();
    }
    function ajusterTranchesAvecNouveauTotal() {
      const totalInitialU = totalActuel.value;
      const nouveauTotalU = nouveauTotal.value;
      const ratio = nouveauTotalU / totalInitialU;

      tableauNouvellesTranches.value = tranches.value.map((tranche) => {
        const debut = parseInt(tranche.heureDebut.split(":")[0], 10);
        const fin = parseInt(tranche.heureFin.split(":")[0], 10) || 24; // Convertir "00:00" en 24
        const tauxAjuste = arrondirAuMultipleLePlusProche(
          tranche.taux * ratio,
          0.025
        );
        return `(${debut}, ${fin}, ${tauxAjuste.toFixed(2)})`; // Conservez deux décimales pour l'affichage
      });

      console.log(
        `Nouvelles tranches ajustées : [${tableauNouvellesTranches.value.join(
          ", "
        )}]`
      );
    }
    function genererTableauTranches() {
      const tableauTranches = tranches.value.map((tranche) => {
        const debut = parseInt(tranche.heureDebut.split(":")[0], 10);
        const fin = parseInt(tranche.heureFin.split(":")[0], 10) || 24; // Convertir "00:00" en 24
        return `(${debut}, ${fin}, ${tranche.taux})`;
      });
      console.log(`tranches = [${tableauTranches.join(", ")}]`);
    }
    function formatterTranches() {
      return tableauNouvellesTranches.value.map((tranche) => {
        const parts = tranche.slice(1, -1).split(", "); // Divisez la chaîne en parties
        const debut = parseInt(parts[0], 10); // Convertissez en entier pour enlever les zéros non nécessaires
        const fin = parseInt(parts[1], 10); // Pareil pour la fin
        const taux = parseFloat(parts[2]).toFixed(2); // Parsez et fixez le format à deux décimales

        const heureDebut = debut === 0 ? "0h" : `${debut}h`; // Ajoutez 'h' pour l'heure
        const heureFin = fin === 0 ? "0h" : `${fin}h`; // Utilisez '0h' si fin est 0, sinon ajoutez 'h'

        return `De ${heureDebut} à ${heureFin} : ${taux} U/H`;
      });
    }

    function ajouterTranche() {
      let nouvelleHeureDebut = "00:00";

      if (tranches.value.length > 0) {
        const derniereTranche = tranches.value[tranches.value.length - 1];
        nouvelleHeureDebut = derniereTranche.heureFin;
      }
      const nouvelleTranche = {
        heureDebut: nouvelleHeureDebut,
        heureFin: "00:00",
        taux: 1.1,
      };
      tranches.value = [...tranches.value, nouvelleTranche];
      calculerTotalActuel();
    }

    function supprimerTranche(index: number) {
      tranches.value.splice(index, 1);
    }
    const totalActuel = ref<number>(0);

    function calculerTotalActuel() {
      totalActuel.value = tranches.value.reduce((total, tranche) => {
        const duree = calculerDuree(tranche.heureDebut, tranche.heureFin);
        return total + duree * tranche.taux;
      }, 0);
    }
    function ajusterHeureFinTranchePrecedente(index: number) {
      if (index > 0) {
        // Assurez-vous qu'il existe une tranche précédente
        const heureDebutActuelle = tranches.value[index].heureDebut;
        tranches.value[index - 1].heureFin = heureDebutActuelle;
      }
    }
    function calculerDuree(heureDebut: string, heureFin: string): number {
      let [heuresDebut] = heureDebut.split(":").map(Number);
      let [heuresFin] = heureFin.split(":").map(Number);
      if (heureFin === "00:00") {
        heuresFin = 24;
      }
      if (heuresFin < heuresDebut) {
        heuresFin += 24;
      }

      return heuresFin - heuresDebut;
    }
    watch(
      tranches,
      () => {
        console.log("Tranches modifiées, recalcul du total");
        calculerTotalActuel();
      },
      { deep: true, immediate: true }
    );

    return {
      tranches,
      ajouterTranche,
      supprimerTranche,
      totalActuel,
      heures,
      mettreAJourHeuresDebut,
      verifierTotal,
      messageErreur,
      nouveauTotal,
      tableauNouvellesTranches,
      arrondirAuMultipleLePlusProche,
      formatterTranches,
      ajusterHeureFinTranchePrecedente,
    };
  },
});
</script>
