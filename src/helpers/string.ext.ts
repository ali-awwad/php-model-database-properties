interface String {
   plural(word: string): string;
}

String.prototype.plural = function (revert: string): string {

   enum Plural {
      '(quiz)$',
      '^(ox)$',
      '([m|l])ouse$',
      '(matr|vert|ind)ix|ex$',
      '(x|ch|ss|sh)$',
      '([^aeiouy]|qu)y$',
      '(hive)$',
      '(?:([^f])fe|([lr])f)$',
      '(shea|lea|loa|thie)f$',
      'sis$',
      '([ti])um$',
      '(tomat|potat|ech|her|vet)o$',
      '(bu)s$',
      '(alias)$',
      '(octop)us$',
      '(ax|test)is$',
      '(us)$',
      '([^s]+)$'
   }

   type PluralMap<C extends object, T> = { [P in keyof C]: T };

   const plural: PluralMap<typeof Plural, string> = {
      '(quiz)$': "$1zes",
      '^(ox)$': "$1en",
      '([m|l])ouse$': "$1ice",
      '(matr|vert|ind)ix|ex$': "$1ices",
      '(x|ch|ss|sh)$': "$1es",
      '([^aeiouy]|qu)y$': "$1ies",
      '(hive)$': "$1s",
      '(?:([^f])fe|([lr])f)$': "$1$2ves",
      '(shea|lea|loa|thie)f$': "$1ves",
      'sis$': "ses",
      '([ti])um$': "$1a",
      '(tomat|potat|ech|her|vet)o$': "$1oes",
      '(bu)s$': "$1ses",
      '(alias)$': "$1es",
      '(octop)us$': "$1i",
      '(ax|test)is$': "$1es",
      '(us)$': "$1es",
      '([^s]+)$': "$1s" 
   };

   enum Singular {
      '(quiz)zes$',
      '(matr)ices$',
      '(vert|ind)ices$',
      '^(ox)en$',
      '(alias)es$',
      '(octop|vir)i$',
      '(cris|ax|test)es$',
      '(shoe)s$',
      '(o)es$',
      '(bus)es$',
      '([m|l])ice$',
      '(x|ch|ss|sh)es$',
      '(m)ovies$',
      '(s)eries$',
      '([^aeiouy]|qu)ies$',
      '([lr])ves$',
      '(tive)s$',
      '(hive)s$',
      '(li|wi|kni)ves$',
      '(shea|loa|lea|thie)ves$',
      '(^analy)ses$',
      '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$',
      '([ti])a$',
      '(n)ews$',
      '(h|bl)ouses$',
      '(corpse)s$',
      '(us)es$',
      's$'
   }

   type SingularMap<C extends object, T> = { [P in keyof C]: T };

   const singular: SingularMap<typeof Singular, string> = {
      '(quiz)zes$': "$1",
      '(matr)ices$': "$1ix",
      '(vert|ind)ices$': "$1ex",
      '^(ox)en$': "$1",
      '(alias)es$': "$1",
      '(octop|vir)i$': "$1us",
      '(cris|ax|test)es$': "$1is",
      '(shoe)s$': "$1",
      '(o)es$': "$1",
      '(bus)es$': "$1",
      '([m|l])ice$': "$1ouse",
      '(x|ch|ss|sh)es$': "$1",
      '(m)ovies$': "$1ovie",
      '(s)eries$': "$1eries",
      '([^aeiouy]|qu)ies$': "$1y",
      '([lr])ves$': "$1f",
      '(tive)s$': "$1",
      '(hive)s$': "$1",
      '(li|wi|kni)ves$': "$1fe",
      '(shea|loa|lea|thie)ves$': "$1f",
      '(^analy)ses$': "$1sis",
      '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
      '([ti])a$': "$1um",
      '(n)ews$': "$1ews",
      '(h|bl)ouses$': "$1ouse",
      '(corpse)s$': "$1",
      '(us)es$': "$1",
      's$': ""
   };

   

   enum Irrigular {
      move
      , foot
      , goose
      , sex
      , child
      , man
      , tooth
      , person
   }

   type IrrigularMap<C extends object, T> = { [P in keyof C]: T };

   const irregular: IrrigularMap<typeof Irrigular, string> = {
      'move': 'moves',
      'foot': 'feet',
      'goose': 'geese',
      'sex': 'sexes',
      'child': 'children',
      'man': 'men',
      'tooth': 'teeth',
      'person': 'people'
   };


   var uncountable = [
      'sheep',
      'fish',
      'deer',
      'moose',
      'series',
      'species',
      'money',
      'rice',
      'information',
      'equipment'
   ];

   // save some time in the case that singular and plural are the same
   if (uncountable.indexOf(this.toLowerCase()) >= 0)
      return this.toString();

   // check for irregular forms
   for (let word in irregular) {

      if (revert) {
         var pattern = new RegExp(irregular[word] + '$', 'i');
         var replace = word;
      } else {
         var pattern = new RegExp(word + '$', 'i');
         var replace = irregular[word];
      }
      if (pattern.test(this.toString()))
         return this.replace(pattern, replace);
   }

   if (revert) {
      for (let reg in singular) {

         var pattern = new RegExp(reg, 'i');

         if (pattern.test(this.toString()))
            return this.replace(pattern, singular[reg]);
      }
   }
   else {
      for (let reg in plural) {

         var pattern = new RegExp(reg, 'i');

         if (pattern.test(this.toString()))
            return this.replace(pattern, plural[reg]);
      }
   };

   // check for matches using regular expressions


   return this.toString();
};