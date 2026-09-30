//download button which user click to download nasheed
import nasheed from '../nasheed.mp3'

const DownloadButton = () => {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = nasheed
    link.download = 'nasheed.mp3'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button onClick={handleDownload}>
      Download Nasheed
    </button>
  )
}

export default DownloadButton
//to use it simply import it in your App.jsx 
// file and include <DownloadButton /> in the JSX where you want the button to appear.