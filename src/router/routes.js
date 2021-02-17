export const routes = [
    {
      path: '/login',
      name: 'Login',
      component: () => import( '../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import( '../views/Register.vue')
    },
    {
      path: '/main',
      name: 'Main',
      component: () => import( '../views/Main.vue'),
      // meta:{
      //   title:'考试汇'
      // },
      children:[
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/main/Home.vue'),
          meta:{
            title:'考试汇'
          },
        },
        {
          path:"me",
          name:"Me",
          component: () => import('../views/main/Me.vue')
        },
        {
          path:"classes",
          name:"Classes",
          component: () => import('../views/classes/Index.vue'),
          children:[
            {
              path:"classesList",
              name:"ClassesList",
              component: () => import('../views/classes/ClassesList.vue')
            },
            {
              path:"classesSpace/:id",
              name:"ClassesSpace",
              component: () => import('../views/classes/ClassesSpace.vue')
            },
          ]
        },
        {
          path:"topic",
          name:"Topic",
          component: () => import('../views/main/Topic.vue')
        },
        {
          path:"myTest",
          name:"MyTest",
          component: () => import('../views/main/MyTest.vue')
        },
        {
          path:"myFinishTest",
          name:"MyFinishTest",
          component: () => import('../views/main/MyFinishTest.vue')
        },
        {
          path:"myCheckTest",
          name:"MyCheckTest",
          component: () => import('../views/main/MyCheckTest.vue'),
        },
        {
          path:"myMessage",
          name:"MyMessage",
          component: () => import('../views/main/myMessage/MyMessage.vue'),
          children:[
            {
              path:"sendMessage",
              name:"SendMessage",
              component: () => import('../views/main/myMessage/SendMessage.vue'),
            },
            {
              path:"inboxes",
              name:"Inboxes",
              component: () => import('../views/main/myMessage/Inboxes.vue'),
            }
          ]
        },
        {
          path:"changeStatus",
          name:"ChangeStatus",
          component: () => import('../views/main/ChangeStatus.vue')
        }
      ]
    },
    {
      path: '/testPaperStu/:tp_id/:c_id',
      name: 'TestPaperStu',
      component: () => import( '../views/TestPaperStu.vue')
    },
    {
      path: '/testPaperTch/:tp_id?',
      name: 'TestPaperTch',
      component: () => import( '../views/TestPaperTch.vue')
    },
    {
      path: '/markTestPaper/:tp_id/:c_id',
      name: 'MarkTestPaper',
      component: () => import( '../views/MarkTestPaper.vue'),
      meta:{
        title: '批改试卷'
    }
    },
  
  
    {
      path:'/*',
      redirect: {
        name: 'Home'
      }
    }
  ]