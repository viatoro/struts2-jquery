<#--
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
-->
<#if parameters.parentTheme == 'xhtml' || parameters.parentTheme == 'simple'>
<#if parameters.parentTheme == 'xhtml'>
<#include "/${parameters.templateDir}/xhtml/controlheader.ftl" />
</#if>
<div id="${parameters.id?html}">
<#include "/${parameters.templateDir}/simple/checkboxlist.ftl" />
</div>
<#if parameters.parentTheme == 'xhtml'>
<#include "/${parameters.templateDir}/xhtml/controlfooter.ftl" />
</#if>
<#else>
<div id="${parameters.id?html}">
<#include "/${parameters.templateDir}/${parameters.parentTheme}/checkboxlist.ftl" />
</div>
</#if>
