import MathSheet from '../components/math-sheet';

export default () => (
  <div>
    <h1>Math Sheet Demo</h1>

    <div className="demo">
      <MathSheet />
      <style jsx global>{`
        body {
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          font-family: 'Open Sans', sans-serif;
        }

        h1 {
          font-size: 20px;
        }
      `}</style>
    </div>
  </div>
)
