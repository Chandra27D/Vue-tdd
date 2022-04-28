  <template>
  <img
    class="flag"
    src="https://countryflagsapi.com/png/tr"
    title="Turkish"
    @click="$i18n.locale = 'tr'"
  />
  <img
    class="flag"
    src="https://countryflagsapi.com/png/gb"
    title="English"
    @click="$i18n.locale = 'en'"
  />
</template>

<style scoped>
  .flag{
    height: 25px;
    width: 25px;
    cursor: pointer;
    margin: 5px;
}
</style>