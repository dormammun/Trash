import { Query, Resolver } from '@nestjs/graphql';
import { DrinkInterface } from '../common/interfaces/drink.interface/drink.interface';
import { CoffeeEntity } from '../coffees/entities/coffee.entity/coffee.entity';
import { TeaEntity } from '../teas/entities/tea.entity/tea.entity';
import { DrinksResultUnion } from './unions/drinks-result.union';

/* DrinkInterface
query Drinks {
  drinks {
    name
  ... on Coffee {
      name
      id
      brand
      createdAt
    }
  ... on Tea {
      name
    }
  }
}
*/

/* DrinksResultUnion
query Drinks {
    drinks {
        ... on Coffee {
            name
            id
            brand
            createdAt
        }
        ... on Tea {
            name
        }
    }
}

*/

@Resolver()
export class DrinksResolver {
  @Query(() => [DrinkInterface], { name: 'drinks' })
  // @Query(() => [DrinksResultUnion], { name: 'drinks' })
  async findAll(): Promise<DrinkInterface[]> {
    // async findAll(): Promise<typeof DrinksResultUnion[]> {
    const coffee = new CoffeeEntity();
    coffee.id = 1;
    coffee.name = 'fake';
    coffee.brand = 'fake';

    const tea = new TeaEntity();
    tea.name = 'fake';

    return [coffee, tea];
  }
}
