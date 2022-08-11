import Choices from "choices.js";

let cryptoArr = [{
    priceBuy: 1.1,
    priceSell: 0.9,
    minValue: 50,
    maxValue: 30000,
    value: 'usdt-trc20',
    name: 'Tether USDT (TRC20)',
  },
  {
    priceBuy: 1.2,
    priceSell: 0.8,
    minValue: 50,
    maxValue: 40000,
    value: 'usdt-erc20',
    name: 'Tether USDT (ERC20)',
  },
  {
    priceBuy: 1.3,
    priceSell: 0.7,
    minValue: 50,
    maxValue: 50000,
    value: 'usdc-erc20',
    name: 'USD Coin USDC (ERC20)',
  },
  {
    priceBuy: 1.4,
    priceSell: 0.6,
    minValue: 60,
    maxValue: 60000,
    value: 'busd-erc20',
    name: 'Binance USD BUSD (ERC20)',
  },
  {
    priceBuy: 1.5,
    priceSell: 0.5,
    minValue: 70,
    maxValue: 70000,
    value: 'usdp-erc20',
    name: 'Pax Dollar USDP (ERC20)',
  }
];

{
  let cryptoSelect = document.querySelector('.block_crypto .select')
  addOption(cryptoSelect, cryptoArr)

  function addOption(select, arr) {
    arr.forEach(obj => {
      let option = select.appendChild(document.createElement('option'))
      option.setAttribute('value', obj.value)
      option.innerHTML = obj.name
    })
  }
}


document.querySelectorAll('.select').forEach(choicesEl => {
  const choice = new Choices(choicesEl, {
    classNames: {
      containerOuter: 'choices block__select',
    },
    searchEnabled: false,
    position: 'bottom',
    itemSelectText: '',
    shouldSort: false,
    placeholder: true,
  });
  let selectedInfoInput = document.querySelector('.active-select-value')
  selectedInfoInput.value = document.querySelector('.block_crypto .choices__item.choices__item--selectable').dataset.value
  choice.passedElement.element.addEventListener('choice', () => {
    setTimeout(() => {
      selectedInfoInput.value = document.querySelector('.block_crypto .choices__item.choices__item--selectable').dataset.value
      let event = new Event('change')
      selectedInfoInput.dispatchEvent(event)
    }, 10);
  })
});

{
  let i = 1
  document.querySelectorAll('.block_crypto .choices__item[data-id]').forEach(item => {
    document.styleSheets[0].addRule(`.block_crypto .choices__item[data-id="${i}"]::before`, `content: url('@img/crypto-icon-${i}.svg'); width: 26px; height: 26px; object-fit: contain;`)
    i++
  })
}

{
  let selectedCryptoInput = document.querySelector('.active-select-value')
  let leftField = document.querySelector('.block_crypto .block__field')
  let rightField = document.querySelector('.block_fiat .block__field')

  let activeCrypto = cryptoArr.find(obj => obj.value == selectedCryptoInput.value)
  leftField.value = activeCrypto.minValue
  rightField.value = parseInt(leftField.value * activeCrypto.priceSell)

  leftField.addEventListener('input', () => {
    let activeCrypto = cryptoArr.find(obj => obj.value == selectedCryptoInput.value)
    rightField.value = parseInt(leftField.value * activeCrypto.priceSell)

    if(getComputedStyle(leftField.closest('.block')).order == 3) {
      rightField.value = parseInt(leftField.value / activeCrypto.priceSell)
    } else {
      rightField.value = parseInt(leftField.value * activeCrypto.priceSell)
    }
  })

  rightField.addEventListener('input', () => {
    let activeCrypto = cryptoArr.find(obj => obj.value == selectedCryptoInput.value)

    if(getComputedStyle(rightField.closest('.block')).order == 3) {
      leftField.value = parseInt(rightField.value / activeCrypto.priceSell)
    } else {
      leftField.value = parseInt(rightField.value * activeCrypto.priceSell)
    }
  })

  selectedCryptoInput.addEventListener('change', (e) => {
    let activeCrypto = cryptoArr.find(obj => obj.value == selectedCryptoInput.value)
    leftField.value = activeCrypto.minValue
    rightField.value = parseInt(leftField.value * activeCrypto.priceSell)
  })
}

{

  let swapBtn = document.querySelector('.swap')
  let crypto = document.querySelector('.block_crypto')
  let cryptoTitle = crypto.querySelector('.block__title')
  let fiat = document.querySelector('.block_fiat')
  let fiatTitle = fiat.querySelector('.block__title')
  let exchangeBtn = document.querySelector('.block__exchange')

  swapBtn.addEventListener('click', () => {
    let cryptoOrder = getComputedStyle(crypto).order;
    crypto.style.order = getComputedStyle(fiat).order
    fiat.style.order = cryptoOrder

    let cryptoClonTitle = cryptoTitle.innerHTML

    cryptoTitle.innerHTML = fiatTitle.innerHTML
    fiatTitle.innerHTML = cryptoClonTitle
    
    exchangeBtn.remove()
    if (getComputedStyle(fiat).order == 3) {
      fiat.appendChild(exchangeBtn)
    } else {
      crypto.appendChild(exchangeBtn)
    }
  })

}
