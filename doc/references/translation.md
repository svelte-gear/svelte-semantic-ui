# SUI Setting Hierarchy

```
sveltekit-i18n.load("fr-sui.json")   -- SUI calendar and validation messages
    -> $.fn.form.settings.prompt     -- validation prompt translation
    -> $.fn.form.settings.text       -- general form logic translation
    -> $.fn.form.*.text              -- calendar, dropdown, modal, pagination, search, progress

sveltekit-i18n.load("fr-CA")         -- locale format settings
    -> $.fn.calendar.settings.*      -- default SUI settings
    -> $.fn.calendar.settings.format -- formatters

use:calendar(settings)               -- settings override

extentRules()
    -> $.fn.form.settings.rules      -- add validation and value comparison rules

```

## Example

```
// Calendar Component
$.fn.calendar.settings.text = {
  days: ['Нд', 'Пн', 'Аў', 'Ср', 'Чц', 'Пт', 'Сб'],
  months: ['Студзень', 'Люты', 'Сакавік', 'Красавік', 'Травень', 'Чэрвень', 'Ліпень', 'Жнівень', 'Верасень', 'Кастрычнік', 'Лістапад', 'Снежань'],
  monthsShort: ['Студ', 'Лют', 'Сак', 'Крас', 'Трав', 'Чэрв', 'Ліп', 'Жнв', 'Врс', 'Кст', 'Лст', 'Снж'],
  today: 'Сёння',
  now: 'Зараз',
  am: 'AM',
  pm: 'PM'
};

// Form Validation
$('.ui.form').form({
  inline: true,
  on: 'blur',
  fields: {
    name: {
      identifier: 'name',
      rules: [
        {
          type: 'empty',
          prompt: 'Калі ласка, увядзіце сваё імя'
        }
      ]
    }
  }
});

// Dropdown Component
$('.ui.dropdown').dropdown({
  placeholder: 'Абярыце',
  text: {
    noResults: 'Нічога не знойдзена'
  }
});

// Modal Component
$('.ui.modal').modal({
  text: {
    ok: 'Добра',
    cancel: 'Адмена'
  }
});

// Pagination Component
$('.ui.pagination.menu').pagination({
  text: {
    first: 'Першы',
    last: 'Апошні',
    next: 'Наступны',
    previous: 'Папярэдні'
  }
});

// Search Component
$('.ui.search').search({
  searchFields: ['title', 'description'],
  text: {
    noResults: 'Нічога не знойдзена',
    placeholder: 'Пошук...'
  }
});

// Progress Component
$('.ui.progress').progress({
  text: {
    active: 'Актыўны',
    success: 'Паспяхова',
    error: 'Памылка'
  }
});

```
