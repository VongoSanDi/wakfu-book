<template>
  <div class="w-full h-auto flex flex-col gap-2">
    <div class="flex w-full h-auto justify-center gap-2">
      <span class="stats-box">
        <strong>PV:</strong>3219
      </span>
      <span class="stats-box">
        <strong>PA:</strong>11
      </span>
      <span class="stats-box">
        <strong>PM:</strong>6
      </span>
      <span class="stats-box">
        <strong>PW:</strong>6
      </span>
    </div>
    <div class="stats-container">
      <span class="stats-box">
        <strong>Maitrise feu:</strong>92
      </span>
      <span class="stats-box">
        <strong>Maitrise eau:</strong>241
      </span>
      <span class="stats-box">
        <strong>Maitrise terre:</strong>95
      </span>
      <span class="stats-box">
        <strong>Maitrise air:</strong>113
      </span>
    </div>
    <div class="stats-container">
      <span class="stats-box">
        <strong>Resistance feu:</strong>38%(216)
      </span>
      <span class="stats-box">
        <strong>Resistance eau:</strong>40%(232)
      </span>
      <span class="stats-box">
        <strong>Resistance terre:</strong>38%(216)
      </span>
      <span class="stats-box">
        <strong>Resistance air:</strong>37%(210)
      </span>
    </div>
    <div class="stats-grid">
      <div class="stats-column">
        <span>
          <strong>Dommage infligé:</strong>15%
        </span>
        <span>
          <strong>Coup critique:</strong>33%
        </span>
        <span>
          <strong>Initiative:</strong>0
        </span>
        <span>
          <strong>Esquive:</strong>159
        </span>
        <span>
          <strong>Sagesse:</strong>0
        </span>
        <span>
          <strong>Controle:</strong>2
        </span>
      </div>
      <div class="stats-column">
        <span>
          <strong>Soin réalisés:</strong>-30%
        </span>
        <span>
          <strong>Parade:</strong>2%
        </span>
        <span>
          <strong>Portée:</strong>3
        </span>
        <span>
          <strong>Tacle:</strong>139
        </span>
        <span>
          <strong>Prospection:</strong>0
        </span>
        <span>
          <strong>Volonté:</strong>0
        </span>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stats-column">
        <span>
          <strong>Maitrise critique:</strong>20
        </span>
        <span>
          <strong>Maitrise dos:</strong>0
        </span>
        <span>
          <strong>Maitrise mélée:</strong>0
        </span>
        <span>
          <strong>Maitrise distance:</strong>442
        </span>
        <span>
          <strong>Maitrise soin:</strong>0
        </span>
        <span>
          <strong>Maitrise berserk:</strong>14
        </span>
      </div>
      <div class="stats-column">
        <span>
          <strong>Resistance critique:</strong>0
        </span>
        <span>
          <strong>Resistance dos:</strong>0
        </span>
        <span>
          <strong>Armure donnée:</strong>0%
        </span>
        <span>
          <strong>Armure reçue:</strong>0%
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
@reference "../assets/main.css";

.stats-box {
  @apply border border-black w-1/4
}

.stats-container {
  @apply flex w-full h-auto justify-between;
}

.stats-grid {
  @apply grid grid-cols-2 h-auto w-full;
}

.stats-column {
  @apply flex flex-col w-full border border-black p-2;
}
</style>
