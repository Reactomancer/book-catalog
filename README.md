Реализовать SPA “Каталог книг” на любом frontend фреймворке/библиотеке. 

Требования:
Хранение данных организовать используя Firestore и соответствующий SDK;
На главной странице должен отображаться список всех книг доступных в системе;
Книги должны быть разбиты на группы по году публикации, группы должны быть отсортированы в обратном порядке (сначала новые), внутри группы книги сортируются по названию;
Нужна возможность добавлять и удалять книги;
Система должна рекомендовать хорошую книгу для прочтения:
Хорошая книга должна пройти проверку временем, поэтому она должна быть издана не менее 3 лет назад;
Из всех проверенных временем книг нужно выбрать лучшие - с самым высоким рейтингом;
Если нашлось несколько хороших книг выбрать одну случайным образом;

Поля книги:
- название (обязательный параметр, не более 100 символов);
- список авторов (книга должна содержать хотя бы одного автора);
- год публикации (опциональный параметр, не раньше 1800);
- рейтинг (опциональный параметр, целое число, от 0 до 10, по умолчанию 0);
- ISBN (опциональный параметр);

Структура вывода данных:
Рекомендуемая книга
2020
Книга А
Книга Б
2018
Книга И
Книга К
Книга Л
2015
Книга Е
Книги без указания года
Книга В

Дополнительные функции (по желанию):
Валидация ISBN;
Смена режима группировки (по рейтингу, по автору);
Редактирование книг;



Пример тестовых данных:

Идеальный программист. Как стать профессионалом разработки ПО
Автор: Роберт Мартин
Год публикации: 2011
Рейтинг: 5
ISBN: 978-5-459-01044-2

Практическое руководство по винокурению
Автор: Павел Иевлев
Год публикации: 2021
Рейтинг: 5
ISBN: 978-5-04-088830-6

7 навыков высокоэффективных людей
Автор: Стивен Кови
Год публикации: 1989
Рейтинг: 5
ISBN: 978-5-9614-2021-0

Цвет волшебства
Автор: Терри Пратчетт
Год публикации: 2011
Рейтинг: 5
ISBN: 978-5-699-15629-0

Психбольница в руках пациентов
Автор: Алан Купер
Год публикации: 2004
Рейтинг: 4
ISBN: 978-5-4461-0674-5

Интрижки мишки
Автор: Елена Галенко
Год публикации: 2021

Чистый код: создание, анализ и рефакторинг
Автор: Роберт Мартин
Рейтинг: 5
ISBN: 978-5-496-00487-9

Джордж и Большой взрыв
Авторы: Стивен Хокинг, Люси Хокинг
Год публикации: 2011
Рейтинг: 5
ISBN: 978-5-4370-0089-2
