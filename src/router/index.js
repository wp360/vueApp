import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/index'
import DetailPage from '@/pages/detail'
import DetailCouPage from '@/pages/detail/count'
import DetailForPage from '@/pages/detail/forecast'
import DetailAnaPage from '@/pages/detail/analysis'
import DetailPubPage from '@/pages/detail/publish'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/detail',
      name: 'DetailPage',
      component: DetailPage,
      redirect: '/detail/count',
			children: [
				{
					path: 'count',
					component: DetailCouPage
				},
				{
					path: 'forecast',
					component: DetailForPage
        },
				{
					path: 'analysis',
					component: DetailAnaPage
				},
				{
					path: 'publish',
					component: DetailPubPage
				}
      ]
    }
  ]
})