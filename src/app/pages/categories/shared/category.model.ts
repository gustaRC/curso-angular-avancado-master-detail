import { BaseResourceModel } from "src/app/shared/models/base-resource.model";

export class Category extends BaseResourceModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string
  ){
    super(); //chamando o constructor da classe extensora/extend === BaseResourceModel
  }

  static fromJson(jsonData: any): Category {
    return Object.assign(new Category(), jsonData); //cria um objeto vazio e atribui os valores do jsonData
  }
}
