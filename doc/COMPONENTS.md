# List of Semantic UI settings

There are 23 settings objects in JQuery:

## Implemented:

### Init\*\* tag

( after the input, may be inside or around )

#### Semantic components

- form <br/>
  `<form ckass="ui form">...</form>` <br/>
  `<InitForm bind:valid={..} settings={..} />`

- calendar <br/>
  `<div class=ui calendar>...</div>` <br/>
  `<InitCalendar value={..} settings={..} />`

- dropdown <br/>
  `<div class=ui dropdown>...</div>` <br/>
  `<InitDropdown value={..} settings={..} />`

- slider <br/>
  `<div class=ui slider>...</div>` <br/>
  `<InitSlider value={..} settings={..} />`

#### Inputs

- input <br/>
  `<input type="text" bind:value={..} />` <br/>
  `<InitNumberInput format={..} bind:number={..} bind:text={..} />` ( type: number ) <br/>
  <br/>
  `<InitDateInput format={..} bind:date={..} bind:text={..} />` ( type: Date ) <br/>
  `<InitTextInput format={..} bind:text={..} />` ( type: string ) <br/>
  `<InitListInput format={..} bind:list={..} bind:text={..} />` ( type: string[] )

- checkbox <br/>
  `<input type="checkbox" bind:checked={..} />` <br/>
  `<InitCheckbox settings={..}`

### Ctrl wrapper

( around the panel )

- modal <br/>
  `<WrapModal show={..} settings={..}>` <br/>
  &nbsp; &nbsp; &nbsp; `<div>...</div>` <br/>
  `</WrapModal>`

### use: action

- popup <br/>
  `<div use:popup={settings}>...</div>`

- sticky <br/>
  `<div use:sticky={settings}>...</div>`

### function

- toast <br/>
  `<script> toast(settings); </script>`

## Have settings, not yet implemented:

- accordion <br/>
  `open: number[]`

- dimmer <br/>
  `show() / hide()`

- flyout <br/>
  `show() / hide()` (beta)

- nag <br/>
  `show() / dismiss()`

- progress <br/>
  `value`

- rating <br/>
  `value`

- search <br/>
  `function()`

- shape <br/>
  `3D object`

- sidebar <br/>
  `show() / hide()`

- tab <br/>
  `path`

## Special:

- api
- embed
- site
- state
- transition
- visibility
