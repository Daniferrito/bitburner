import { IMap } from "./types";
import { post } from "./ui/postToTerminal";

export let Aliases: IMap<string> = {};
export let GlobalAliases: IMap<string> = {};

export function loadAliases(saveString: string): void {
    if (saveString === "") {
        Aliases = {};
    } else {
        Aliases = JSON.parse(saveString);
    }
}

export function loadGlobalAliases(saveString: string): void {
    if (saveString === "") {
        GlobalAliases = {};
    } else {
        GlobalAliases = JSON.parse(saveString);
    }
}

// Prints all aliases to terminal
export function printAliases(): void {
    for (var name in Aliases) {
        if (Aliases.hasOwnProperty(name)) {
            post("alias " + name + "=" + Aliases[name]);
        }
    }
    for (var name in GlobalAliases) {
        if (GlobalAliases.hasOwnProperty(name)) {
            post("global alias " + name + "=" + GlobalAliases[name]);
        }
    }
}

// Returns true if successful, false otherwise
export function parseAliasDeclaration(dec: string, global = false): boolean {
    var re = /^([_|\w|!|%|,|@]+)="(.+)"$/;
    var matches = dec.match(re);
    if (matches == null || matches.length != 3) {return false;}
    if (global){
        addGlobalAlias(matches[1],matches[2]);
    } else {
        addAlias(matches[1], matches[2]);
    }
    return true;
}

function addAlias(name: string, value: string): void {
    if (name in GlobalAliases) {
        delete GlobalAliases[name];
    }
    Aliases[name] = value;
}

function addGlobalAlias(name: string, value: string): void {
    if (name in Aliases){
        delete Aliases[name];
    }
    GlobalAliases[name] = value;
}

function getAlias(name: string): string | null {
    if (Aliases.hasOwnProperty(name)) {
        return Aliases[name];
    }

    return null;
}

function getGlobalAlias(name: string): string | null {
    if (GlobalAliases.hasOwnProperty(name)) {
        return GlobalAliases[name];
    }
    return null;
}

export function removeAlias(name: string): boolean {
    if (Aliases.hasOwnProperty(name)) {
        delete Aliases[name];
        return true;
    }

    if (GlobalAliases.hasOwnProperty(name)) {
        delete GlobalAliases[name];
        return true;
    }

    return false;
}

/**
 * Returns the original string with any aliases substituted in.
 * Aliases are only applied to "whole words", one level deep
 */
export function substituteAliases(origCommand: string): string {
    const commandArray = origCommand.split(" ");
    if (commandArray.length > 0){
        // For the unalias command, dont substite
        if (commandArray[0] === "unalias") { return commandArray.join(" "); }

        var alias = getAlias(commandArray[0]);
        if (alias != null) {
            commandArray[0] = alias;
        } else {
            var alias = getGlobalAlias(commandArray[0]);
            if (alias != null) {
                commandArray[0] = alias;
            }
        }
        for (var i = 0; i < commandArray.length; ++i) {
            var alias = getGlobalAlias(commandArray[i]);
            if (alias != null) {
                commandArray[i] = alias;
            }
        }
    }
    return commandArray.join(" ");
}
