import searchPage from '@/components/search/index';

searchPage.install = (Vue) => {
    Vue.component(searchPage.name, searchPage)
}
export default searchPage