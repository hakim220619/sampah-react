const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      path: '/'
    },

    {
      title: 'Master Data',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: 'Admin',
          path: '/admin'
        },
        {
          title: 'Wilayah',
          path: '/wilayah'
        },
        {
          title: 'Paket',
          path: '/paket'
        }
      ]
    },
    {
      title: 'Post',
      icon: 'mdi-newspaper',
      path: '/post'
    }
  ]
}

export default navigation
