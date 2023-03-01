import Cookies from 'js-cookie'

const useAppStore = defineStore(
  'app',
  {
    state: () => ({
      sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false,
        hide: false
      },
      device: 'desktop',
      size: Cookies.get('size') || 'default',
      // 默认路由地址
      defaultPath: '/personnal',
      isOption: false
    }),
    actions: {
      toggleSideBar(withoutAnimation) {
        if (this.sidebar.hide) {
          return false;
        }
        this.sidebar.opened = !this.sidebar.opened
        this.sidebar.withoutAnimation = withoutAnimation
        if (this.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
      },
      closeSideBar({ withoutAnimation }) {
        Cookies.set('sidebarStatus', 0)
        this.sidebar.opened = false
        this.sidebar.withoutAnimation = withoutAnimation
      },
      toggleDevice(device) {
        this.device = device
      },
      setSize(size) {
        this.size = size;
        Cookies.set('size', size)
      },
      toggleSideBarHide(status) {
        this.sidebar.hide = status
      },
      // 设置首次打开后默认的路由
      setDefaultPath(path) {
        this.defaultPath = path
      },
      // 获取默认路由地址（打开时默认的路由地址）
      getDefaultPath() {
        if (!this.isOption) {
          this.isOption = true
          return this.defaultPath
        }
        else {
          return null
        }
      },
      // 当路由发生跳转时，执行
      // option() {
      //   this.isOption = true
      // }

    }
  })

export default useAppStore
