import Vue from 'vue'
import Router from 'vue-router'
import RouteList from './router.json'
Vue.use(Router)
function RouteFormat (Arr) {
  if (Arr) {
    return Arr.map((item) => {
      return {
        path: item.path,
        component: () => import(`../page${item.path}/index.vue`),
        children: RouteFormat(item.children)
      }
    })
  } else {
    return []
  }
}
console.log(RouteFormat(RouteList))
export default new Router({
  routes: RouteFormat(RouteList)
})
