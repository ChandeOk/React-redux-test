import './Controls.css'

interface IControlsProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onBack: () => void;
}

function Controls({currentPage, totalPages, onNext, onBack}: IControlsProps) {
  return (
    <div className='controls'>
      <button disabled={currentPage === 1} onClick={onBack}>Back</button>{`${currentPage}/${totalPages}`}<button onClick={onNext} disabled={currentPage === totalPages}>Next</button>
    </div>
  )
}

export default Controls