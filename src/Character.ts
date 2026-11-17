// import type { WeaponKind } from './Weapon.ts';
import { Weapon } from './Weapon.ts';

export abstract class Character {
    public readonly name: string;
    public readonly maxHealth: number;
    public readonly baseAttack: number;
    public readonly baseDefense: number;
    private _health: number;
    private _weapon: Weapon | null;

    public constructor(name: string, health: number, baseAttack: number, baseDefense: number){
        if (health <= 0) {
            throw new Error (`The health of ${name} must be strictly positive.`);
        }
        this.name = name;
        this.maxHealth = health;
        this._health = health;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this._weapon = null;
    }

    public get health(): number{
        return this._health;
    }

    public abstract getAttack(): number;
    // {return this.baseAttack * this._weapon.attackBonus;}

    public abstract canEquip(weapon: Weapon): boolean;

    protected getWeaponAttackBonus(): number {
        if (this._weapon.attackBonus != null) {
            return this._weapon.attackBonus;
        }
        return 0;
    }

    public isAlive(): boolean{
        if (this._health > 0) {
            return true;
        }
        return false;
    }

    public describe(): string{
        if (this._weapon === null) {
            return (`${this.name} - health ${this._health}/${this.maxHealth} - attack ${this.baseAttack} - defense ${this.baseDefense} - weapon: none`);
        }
        return (`${this.name} - health ${this._health}/${this.maxHealth} - attack ${this.baseAttack+this._weapon.attackBonus} - defense ${this.baseDefense} - weapon: ${this._weapon.name}`);
    }

    public equip(weapon: Weapon): void{
        if (!this.canEquip(weapon)) {
            throw new Error (`${this.name} cannot equip ${weapon.name}.`);
        }
        this._weapon = weapon;
    }

    public takeDamage(amount: number): void{
        if (this._health - amount < 0) {
            this._health = 0;
        }
        else{this._health -= amount;}
    }

    public heal(amount: number): void{
        if (this._health + amount > this.maxHealth) {
            this._health = this.maxHealth;
        }
        else{this._health += amount;}
    }

    protected computeDamage(target: Character): number{
        if (this === target) {
             throw new Error (`${this.name} cannot attack themselves.`);
        }
        if (this.baseAttack <= target.baseDefense) {
            return 0;
        }
        let degatTotaux = 0;
        if (this._weapon === null) {
            degatTotaux = this.baseAttack - target.baseDefense;
        }
        else{degatTotaux = this.baseAttack+this._weapon.attackBonus - target.baseDefense;}
       
        if (degatTotaux > target._health) {
            return target._health;
        }
        return degatTotaux;
    }

    public attack(target: Character): number{
        if (!this.isAlive()) {
            throw new Error (`${this.name} is KO and cannot attack.`);
        }
        if (this === target) {
            throw new Error (`${this.name} cannot attack themselves.`);
        }
        if (!target.isAlive()) {
            throw new Error (`${target.name} is already KO.`);
        }

        const damageTaken = this.computeDamage(target)
        target.takeDamage(damageTaken);
        console.log(`${this.name} hits ${target.name} for ${damageTaken} damage (${target.name}: ${target._health}/${target.maxHealth}).`)
        if (!target.isAlive) {
            console.log(`${target.name} is KO!`)
        }
        return damageTaken;
    }

}