<template>
  <div>
    <h2 class="font-avenir mt-10 p-5 ml-6 sm:text-xl mb-4">
      Résulats calculateur de Répartition des Unités
    </h2>
    <div
      v-if="resultats && resultats.tranches && resultats.tranches.length > 0"
    >
      <table class="w-[95%] mx-auto">
        <thead>
          <tr>
            <th
              class="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Début
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-300 git push -u origin master

              bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Fin
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              U/h
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(res, index) in resultats.tranches"
            :key="index"
            class="border-b border-gray-300"
          >
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{ res.debut }}
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{ res.fin }}
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {{ res.tauxAjuste }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-evenly m-10">
        <button
          class="flex items-center gap-3 text-white bg-[#107c41] p-4 font-avenir font-medium text-[20px] mx-2"
          @click="exporterVersExcel"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11 0H9V9H0V11H9V20H11V11H20V9H11V0Z"
              fill="#fff"
            />
          </svg>
          <p class="text-white">Télécharger au format Excel</p>
        </button>
        <RouterLink to="/">
          <button
            @click="verifierTotal"
            class="flex items-center gap-3 text-white bg-[#140F4B] p-4 font-avenir font-medium text-[20px] mx-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11 0H9V9H0V11H9V20H11V11H20V9H11V0Z"
                fill="#FFFEFE"
              />
            </svg>

            <p>Crée un nouveau tableau des débits de base</p>
          </button>
        </RouterLink>
      </div>
    </div>
    <div v-else>
      <p>Aucun résultat trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as XLSX from "xlsx";

const resultats = ref({ tranches: [] });

onMounted(() => {
  const resultatsStockes = localStorage.getItem("resultats");
  if (resultatsStockes) {
    const data = JSON.parse(resultatsStockes);
    resultats.value = data;
  }
});

const exporterVersExcel = () => {
  // Optionnel : Renommer les clés si nécessaire pour correspondre aux en-têtes souhaités
  const donneesAvecEnTetes = resultats.value.tranches.map((res) => ({
    Début: res.debut, // "Début" sera le nom de la première colonne
    Fin: res.fin, // "Fin" pour la deuxième colonne
    "U/h": res.tauxAjuste, // "U/h" pour la troisième colonne
  }));

  // Création de la feuille à partir des données ajustées
  const ws = XLSX.utils.json_to_sheet(donneesAvecEnTetes, { skipHeader: true });

  // Pour ajouter des en-têtes personnalisés, vous pouvez soit les définir directement dans le JSON,
  // soit utiliser les options de `json_to_sheet` pour ajuster les en-têtes.

  // Ajout d'une ligne d'en-tête au début de la feuille
  XLSX.utils.sheet_add_aoa(ws, [["Début", "Fin", "U/h"]], { origin: "A1" });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Resultats");
  XLSX.writeFile(wb, "resultats.xlsx");
};
</script>
