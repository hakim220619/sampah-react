import { useEffect, useState } from 'react'
import CKeditorDesc from 'src/pages/apps/paket/ckeditor/custom-editor'
export default function index() {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [data, setData] = useState('')
  useEffect(() => {
    setEditorLoaded(true)
  }, [])
  return (
    <div>
      <CKeditorDesc
        name='description'
        onChange={data => {
          setData(data)
        }}
        editorLoaded={editorLoaded}
      />
      {JSON.stringify(data)}
    </div>
  )
}
