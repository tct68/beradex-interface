import { parse } from 'qs'
import { Field } from './actions'
import { queryParametersToSwapState } from './hooks'

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('BERA to DAI', () => {
      expect(
        queryParametersToSwapState(
          parse(
            '?inputCurrency=BERA&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT',
            { parseArrays: false, ignoreQueryPrefix: true }
          )
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0x197b2e6678b32CeA414F6b08Dd764a6612292fE5' },
        [Field.INPUT]: { currencyId: 'BERA' },
        typedValue: '20.5',
        independentField: Field.OUTPUT,
        recipient: null,
      })
    })

    test('does not duplicate eth for invalid output token', () => {
      expect(
        queryParametersToSwapState(parse('?outputCurrency=invalid', { parseArrays: false, ignoreQueryPrefix: true }))
      ).toEqual({
        [Field.INPUT]: { currencyId: 'BERA' },
        [Field.OUTPUT]: { currencyId: '' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('output BERA only', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BERA&exactAmount=20.5', { parseArrays: false, ignoreQueryPrefix: true })
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BERA' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('invalid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BERA&exactAmount=20.5&recipient=abc', { parseArrays: false, ignoreQueryPrefix: true })
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BERA' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BERA&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5', {
            parseArrays: false,
            ignoreQueryPrefix: true,
          })
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BERA' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
      })
    })
    test('accepts any recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BERA&exactAmount=20.5&recipient=bob.argent.xyz', {
            parseArrays: false,
            ignoreQueryPrefix: true,
          })
        )
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BERA' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: 'bob.argent.xyz',
      })
    })
  })
})
