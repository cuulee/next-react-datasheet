import React from 'react';
import _ from 'lodash'
import Datasheet from 'react-datasheet'
import mathjs from 'mathjs';

export default class MathSheet extends React.Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this);
    this.state = {
      'A1': {key: 'A1', value: '200', expr: '200'},
      'A2': {key: 'A2', value: '200', expr: '=A1', className:'equation'},
      'A3': {key: 'A3', value: '', expr: ''},
      'A4': {key: 'A4', value: '', expr: ''},
      'B1': {key: 'B1', value: '', expr: ''},
      'B2': {key: 'B2', value: '', expr: ''},
      'B3': {key: 'B3', value: '', expr: ''},
      'B4': {key: 'B4', value: '', expr: ''},
      'C1': {key: 'C1', value: '', expr: ''},
      'C2': {key: 'C2', value: '', expr: ''},
      'C3': {key: 'C3', value: '', expr: ''},
      'C4': {key: 'C4', value: '', expr: ''},
      'D1': {key: 'D1', value: '', expr: ''},
      'D2': {key: 'D2', value: '', expr: ''},
      'D3': {key: 'D3', value: '', expr: ''},
      'D4': {key: 'D4', value: '', expr: ''}
    }
  }


  generateGrid() {
    return [0, 1,2,3,4].map((row, i) =>
      ['', 'A', 'B', 'C', 'D'].map((col, j) => {
        if(i == 0 && j == 0) {
          return {readOnly: true, value: ''}
        }
        if(row === 0) {
          return {readOnly: true, value: col}
        }
        if(j === 0) {
          return {readOnly: true, value: row}
        }
        return this.state[col + row]
      })
    )
  }

  validateExp(trailKeys, expr) {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.map(match => {
      if(trailKeys.indexOf(match) > -1) {
        valid = false
      } else {
        valid = this.validateExp([...trailKeys, match], this.state[match].expr)
      }
    })
    return valid
  }

  computeExpr(key, expr, scope) {
    let value = null;
    if(expr.charAt(0) !== '=') {
      return {className: '', value: expr, expr: expr};
    } else {
      try {
        value = mathjs.eval(expr.substring(1), scope)
      } catch(e) {
        value = null
      }

      if(value !== null && this.validateExp([key], expr)) {
        return {className: 'equation', value, expr}
      } else {
        return {className: 'error', value: 'error', expr: ''}
      }
    }
  }

  cellUpdate(state, changeCell, expr) {
    const scope = _.mapValues(state, (val) => isNaN(val.value) ? 0 : parseInt(val.value))
    const updatedCell = _.assign({}, changeCell, this.computeExpr(changeCell.key, expr, scope))
    state[changeCell.key] = updatedCell

    _.each(state, (cell, key) => {
      if(cell.expr.charAt(0) === '=' && cell.expr.indexOf(changeCell.key) > -1 && key !== changeCell.key) {
        state = this.cellUpdate(state, cell, cell.expr)
      }
    })
    return state
  }

  onChange(changeCell, i, j, expr) {
    const state = _.assign({}, this.state)
    this.cellUpdate(state, changeCell, expr)
    this.setState(state)
  }

  render() {
    return (
      <div>
        <Datasheet
          data={this.generateGrid()}
          valueRenderer={(cell) => cell.value}
          dataRenderer={(cell) => cell.expr}
          onChange={this.onChange}
        />
        <style jsx global>{`
          table.data-grid {
            table-layout: fixed;
            border-collapse: collapse;
            width: 100%;
          }

          table.data-grid td.cell.updated {
            background-color: rgba(0, 145, 253, 0.16);
            transition : background-color 0ms ease ;
          }

          table.data-grid td.cell {
            height: 17px;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            cursor: cell;
            background-color: none;
            transition : background-color 500ms ease;
            vertical-align: middle;
            text-align: right;
            border: 1px solid #DDD;
            padding: 0;
          }

          table.data-grid td.cell.selected {
            border: 1px solid rgb(33, 133, 208);
            border-style:double;
            transition: none;
          }

          table.data-grid td.cell.selected {
            box-shadow: inset 0px -100px 0px rgba(33, 133, 208, 0.15);
          }

          table.data-grid td.cell.read-only {
            background: whitesmoke;
            color: #999;
            text-align: center;
          }

          table.data-grid td.cell > div.text {
            padding: 2px 5px;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          table.data-grid td.cell > input {
            outline: none !important;
            border: 2px solid rgb(33, 133, 208);
            text-align:right;
            width: calc(100% - 6px);
            height: 11px;
            background: none;
          }

          .equation.cell {
            position: relative;
          }

          .error.cell {
            background: rgba(255,0,0,0.14);
            font-size: 0.8em;
            color: red;
          }

          .error.cell > div.text {
            text-align: center;
          }

          .equation.cell:before {
            content: '';
            width: 0;
            height: 0;
            position: absolute;
            left: 0;
            top: 0;
            border-style: solid;
            border-width: 6px 6px 0 0;
            border-color: #2185d0 transparent transparent transparent;
            z-index: 2;
          }
        `}</style>
      </div>
    )
  }
}
